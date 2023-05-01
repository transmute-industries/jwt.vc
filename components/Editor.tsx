import React, { useEffect, useRef } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-text'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/theme-one_dark'
import 'ace-builds/src-noconflict/ext-language_tools'

type EditorProps = {
  mode: string
  value: string
  onChange?: any
  sx?: any
}

const Editor = ({ mode, value, onChange, sx }: EditorProps) => {
  const aceEditor: any = useRef()
  useEffect(() => {
    const {editor} = aceEditor.current;
    editor.setOptions({
      useWorker: false,
      showGutter: false,
      showPrintMargin: false,
      indentedSoftWrap: false,
    }) 
    const prevMarkers = editor.session.getMarkers();
    if (prevMarkers) {
      const prevMarkersArr = Object.keys(prevMarkers);
      for (let item of prevMarkersArr) {
        editor.session.removeMarker(prevMarkers[item].id);
      }
    }
  }, [value])
  return (
    <AceEditor
      ref={aceEditor}
      style={{
        height: '200px',
        width: '100%',
        ...sx
      }}
      mode={mode}
      theme="one_dark"
      wrapEnabled={true}
      value={value}
      onChange={onChange}
    />
  )
}

export default Editor
