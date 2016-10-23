@ECHO OFF
::references
REM http://stackoverflow.com/questions/7425360/batch-file-to-search-for-a-string-within-directory-names
::variables
SETLOCAL EnableDelayedExpansion
SET validpathterm=.corecommerce
SET destroot=.\dest

FOR /f "delims=" %%i IN ( ' dir /ad/b "%destroot%"' ) DO (
	REM SET /a str1=eu
	REM Set DWRPATH="%%i
	REM if not x%str1:bcd=%==x%str1% (
		REM robocopy ".\origin" "%destroot%\%%i" /IS /s 
		REM ECHO "copiado em %destroot%\%%i %str1%" 
		 REM ECHO "copiado em %%i\%str1%" 
	REM ) 
	

	REM echo "%%i"
	SET "folder=%%i"
	if /I NOT "!folder:corecommerce=!"=="!folder!" (
		ECHO "copiado em %%i" 
	)
   REM set AntiVirus1="adobe"
)

REM echo %AntiVirus1% found

pause