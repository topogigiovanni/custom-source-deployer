@ECHO OFF
SETLOCAL EnableDelayedExpansion
::references
REM http://stackoverflow.com/questions/7425360/batch-file-to-search-for-a-string-within-directory-names
::variables
SET destroot=.\dest

CLS
ECHO 1.HGL
ECHO 2.PRD
ECHO.

CHOICE /C 12 /M "Escolha o ambiente:"

:: Note - list ERRORLEVELS in decreasing order
IF ERRORLEVEL 2 GOTO Prd
IF ERRORLEVEL 1 GOTO Hlg

goto End

::subroutines
:Prd
	ECHO Deploy em PRD
GOTO DefineSettings

:Hlg
	ECHO Deploy em HLG
GOTO DefineSettings

:DefineSettings
	set /p include=Incluir apenas(todas):
	set /p exclude=Excluir apenas(nenhuma):

	if "%include%"=="" (
		REM ECHO "inclui todas"
	) 
	if NOT "%include%"=="" (
		REM ECHO "%include%"
	)

	if "%exclude%"=="" (
		REM ECHO "exclui nenhuma"
	) 
	if NOT "%exclude%"=="" (
		REM ECHO "%exclude%"
	)

GOTO Run

:Run
	FOR /f "delims=" %%i IN ( ' dir /ad/b "%destroot%"' ) DO (

		REM echo "%%i"
		SET isValid=1
		SET "folder=%%i"
		if /I NOT "!folder:corecommerce=!"=="!folder!" (
			REM robocopy ".\origin" "%destroot%\%%i" /IS /s 
			REM TODO: stop here
			ECHO "isValidpri %isValid%"
			call :EvaluateParam isValid %%i
			ECHO "isValid %isValid%"
			if "%isValid%"=="1" (
				ECHO "copiado em %%i" 
			)
		)
	   
	)
GOTO End

:ParseInclude
	SET list=%1
	SET list=%list:"=%
	SET __isValid = 0;
	FOR /f "tokens=1* delims= " %%a IN ("%list%") DO (
		SET "_candidate=%2"
		SET "_folder=%%a"
		SET "%3=1"
		if /I NOT "!_candidate:%_folder%=!"=="!_candidate!" (
			SET __isValid=1
			REM call :sub %%a
			REM ECHO find include %_folder% %_candidate% %2
		)
		if not "%%b" == "" call :ParseInclude "%%b" %2 %3
	)
	
	SET %3=%__isValid%

GOTO Eos

:ParseExclude
	SET list=%1
	SET list=%list:"=%
	SET __isValid = 1;
	FOR /f "tokens=1* delims= " %%a IN ("%list%") DO (
		SET "_candidate=%2"
		SET "_folder=%%a"
		if /I NOT "!_candidate:%_folder%=!"=="!_candidate!" (
			SET __isValid=0
			REM SET "%3=0"
			REM call :sub %%a
			REM ECHO find include %_folder% %_candidate% %2
		)
		if not "%%b" == "" call :ParseExclude "%%b" %2 %3
	)
	
	SET %3=%__isValid%

GOTO Eos

:EvaluateParam
	SET isValid=1
	SET candidate=%2
	call :EvaluateInclude isValid %candidate%
	if "%isValid%"=="1" (
		call :EvaluateExclude isValid %candidate%
	) 
	SET %1=%isValid%
GOTO Eos

:EvaluateInclude
	SET candidate=%2
	if "%include%"=="" (
		SET "%1=1"
	) 
	if NOT "%include%"=="" (
		call :ParseInclude %include% %candidate% %1
		REM set "%1=0"
	)
GOTO Eos

:EvaluateExclude
	SET candidate=%2
	if "%exclude%"=="" (
		set "%1=1"
	) 
	if NOT "%exclude%"=="" (
		call :ParseExclude %exclude% %candidate% %1
		REM set "%1=0"
	)
GOTO Eos

:End
PAUSE

:Eos
endlocal
