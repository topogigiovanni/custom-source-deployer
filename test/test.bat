@ECHO OFF
SETLOCAL EnableDelayedExpansion

::references
REM http://stackoverflow.com/questions/7425360/batch-file-to-search-for-a-string-within-directory-names

::variables
SET isDebug=1
SET isLogger=1
SET destroot=.\dest
SET isValid=1

CLS
ECHO 1.HGL
ECHO 2.PRD
ECHO.

CHOICE /C 12 /M "Escolha o ambiente:"

:: Note - list ERRORLEVELS in decreasing order
IF ERRORLEVEL 2 call :Prd isValid
IF ERRORLEVEL 1 call :Hlg isValid

goto End

::subroutines
:Prd
	ECHO Deploy em PRD
	call :DefineSettings isValid
GOTO Eos

:Hlg
	ECHO Deploy em HLG
	call :DefineSettings isValid
GOTO Eos

:DefineSettings
	set /p include=Incluir apenas(todas):
	set /p exclude=Excluir apenas(nenhuma):

	call :Run isValid
GOTO Eos

:Run
	SETLOCAL EnableDelayedExpansion
	FOR /f "delims=" %%i IN ( ' dir /ad/b "%destroot%"' ) DO (
		SET %1=0
		call :Debugger "fst isValidpri %isValid% !%1!"
		SET "folder=%%i"
		if /I NOT "!folder:corecommerce=!"=="!folder!" (
			
			call :Debugger "isValid =second= %isValid% !isValid!"
			call :EvaluateParam isValid %%i
			call :Debugger "isValid =third= %isValid% !isValid!"
			if "!isValid!"=="1" (
				robocopy ".\origin" "%destroot%\%%i" /IS /s 
				ECHO copiado para %%i com sucesso!
			)
		)
	   
	)
	SET %1=6nive--out
GOTO Eos

:EvaluateParam
	SET candidate=%2
	call :EvaluateInclude isValid %candidate%
	if "!isValid!"=="1" (
		call :EvaluateExclude isValid %candidate%
	) 
GOTO Eos

:EvaluateInclude
	SET candidate=%2
	if "%include%"=="" (
		SET %1=1
	) 
	if NOT "%include%"=="" (
		call :ParseInclude "%include%" %2 isValid
	)
GOTO Eos

:EvaluateExclude
	SET candidate=%2
	if "%exclude%"=="" (
		set %1=1
	) 
	if NOT "%exclude%"=="" (
		call :ParseExclude "%exclude%" %2 isValid
	)
GOTO Eos

:ParseInclude
	SET list=%1
	SET list=%list:"=%
	SET __isValid=0
	SET %3=0
	FOR /f "tokens=1* delims= " %%a IN ("%list%") DO (
		SET "_candidate=%2"
		call :Debugger "in for include %%a %%b %_candidate% !_candidate! %2"
		if /I NOT "!_candidate:%%a%=!"=="!_candidate!" (
			SET __isValid=1
			SET %3=1
			call :Debugger "find include %%a %%b %_candidate% !_candidate! %2"
			GOTO Eos
		)
		if not "%%b"=="" call :ParseInclude "%%b" %2 %3
	)
	
	SET %3=%__isValid%
GOTO Eos

:ParseExclude
	SET list=%1
	SET list=%list:"=%
	SET __isValid=1
	SET %3=1
	FOR /f "tokens=1* delims= " %%a IN ("%list%") DO (
		SET "_candidate=%2"
		call :Debugger "logged in for exclude %%a %_candidate% !_candidate! %2"
		if /I NOT "!_candidate:%%a%=!"=="!_candidate!" (
			SET __isValid=0
			SET %3=0
			call :Debugger "logged %%a %_candidate% !_candidate! %2"
			GOTO Eos
		)
		if not "%%b"=="" call :ParseExclude "%%b" %2 %3
	)
	
	SET %3=%__isValid%
GOTO Eos

:Logger
	SET log=%1
	SET log=%log:"=%
	if "%isLogger%"=="1" (
		ECHO [LOGGER] %log%
	)
GOTO Eos

:Debugger
	SET log=%1
	SET log=%log:"=%
	if "%isDebug%"=="1" (
		ECHO [DEBUGGER] %log%
	)
GOTO Eos

:End
PAUSE

:Eos
endlocal
