import React, { useEffect, useRef } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-text'
import 'ace-builds/src-noconflict/theme-one_dark'
import 'ace-builds/src-noconflict/ext-language_tools'

declare var ace:any;
const { Range } = ace.require('ace/range')

type EditorProps = {
  value: string
  onChange?: any
}

const Editor = ({ value, onChange }: EditorProps) => {
  const aceEditor: any = useRef()
  useEffect(() => {
    const {editor} = aceEditor.current;
    editor.setOptions({
      useWorker: false,
      showGutter: false,
      showPrintMargin: false,
      indentedSoftWrap: false,
    })
    const [header, payload, signature] = value.split('.');
    editor.session.addMarker(
      new Range(0,value.indexOf(header),0,value.indexOf(payload) -1),
      `transmute-jwt-header`,
      'text'
    )
    editor.session.addMarker(
      new Range(0,value.indexOf(payload),0,value.indexOf(signature) -1),
      `transmute-jwt-payload`,
      'text'
    )
    editor.session.addMarker(
      new Range(0,value.indexOf(signature),0,value.length),
      `transmute-jwt-signature`,
      'text'
    )
    const prevMarkers = editor.session.getMarkers();
    if (prevMarkers) {
      const prevMarkersArr = Object.keys(prevMarkers);
      for (let item of prevMarkersArr) {
        if (!prevMarkers[item].clazz.includes('transmute')){
          editor.session.removeMarker(prevMarkers[item].id);
        }
      }
    }
  }, [value])
  return (
    <AceEditor
      ref={aceEditor}
      style={{
        height: '200px',
        width: '100%',
      }}
      mode="text"
      theme="one_dark"
      wrapEnabled={true}
      value={value}
      onChange={onChange}
    />
  )
}

export default Editor