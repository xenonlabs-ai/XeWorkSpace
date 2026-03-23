; Custom NSIS installer script for XeWorkspace Agent
; This script handles killing the running process before installation

!macro customInit
  ; Kill any running instances of the app before installation
  nsExec::ExecToLog 'taskkill /F /IM "XeWorkspace Agent.exe"'
  nsExec::ExecToLog 'taskkill /F /IM "xeworkspace-agent.exe"'

  ; Give the process time to fully terminate
  Sleep 1000
!macroend

!macro customInstall
  ; Additional install steps if needed
!macroend

!macro customUnInit
  ; Kill any running instances before uninstall
  nsExec::ExecToLog 'taskkill /F /IM "XeWorkspace Agent.exe"'
  nsExec::ExecToLog 'taskkill /F /IM "xeworkspace-agent.exe"'
  Sleep 1000
!macroend
