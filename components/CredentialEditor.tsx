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

  return (
    <AceEditor
      style={{
        height: '200px',
        width: '100%',
        ...sx
      }}
      mode={mode}
      theme="one_dark"
      value={value}
      onChange={onChange}
    />
  )
}

export default Editor
