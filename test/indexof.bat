@ECHO OFF
SET var=Tomcatito98
SET varName=Jomdowe

SET searchVal=Tomcat
SET var|FINDSTR /b "var="|FINDSTR /i %searchVal% >nul
IF ERRORLEVEL 1 (echo It does't contain Tomcat) ELSE (echo It contains Tomcat)

SET varName|FINDSTR /b "varName="|FINDSTR /i %searchVal% >nul
IF ERRORLEVEL 1 (echo It does't contain Tomcat) ELSE (echo It contains Tomcat)

pause