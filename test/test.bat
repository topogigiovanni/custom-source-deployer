@ECHO OFF
SETLOCAL EnableDelayedExpansion
::references
REM http://stackoverflow.com/questions/7425360/batch-file-to-search-for-a-string-within-directory-names
::variables
SET destroot=.\dest

FOR /f "delims=" %%i IN ( ' dir /ad/b "%destroot%"' ) DO (

	REM echo "%%i"
	SET "folder=%%i"
	if /I NOT "!folder:corecommerce=!"=="!folder!" (
		REM robocopy ".\origin" "%destroot%\%%i" /IS /s 
		ECHO "copiado em %%i" 
	)
   
)


pause