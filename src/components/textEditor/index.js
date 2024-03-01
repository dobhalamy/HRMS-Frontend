import React, { useCallback, useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { Button, Card, notification } from 'antd'
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import DOMPurify from 'dompurify'
import { fetchStaticContent } from 'redux/config/actions'
import { staticContent } from 'services/axios/config'
import { useDispatch, connect } from 'react-redux'
import style from './style.module.scss'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const TextEditor = ({ title, response }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const dispatch = useDispatch()
  const createData = async (text) => {
    const value = {
      content: text,
      title,
    }
    const staticResponse = await staticContent(value)
    if (staticResponse?.data?.statusCode === 200 && staticResponse?.status === 200) {
      notification.success({
        message: 'success',
        description: `Content updated ${staticResponse?.data?.message}fully`,
      })
      fetchData()
    }
  }

  const onEditorStateChange = (text) => {
    setEditorState(text)
  }
  const createMarkup = (content) => {
    const blocks = content.map((item) => {
      if (item?.type === 'text') {
        return DOMPurify.sanitize(item?.content)
      }
      if (item?.type === 'image') {
        return `<img src="${item?.src}" alt="${item?.alt}" />`
      }
      return ''
    })

    const html = blocks.join('')
    return { __html: html }
  }

  const handelSave = () => {
    createData(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }
  const fetchData = useCallback(() => {
    dispatch(fetchStaticContent(title))
  }, [dispatch, title])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (response && response?.length > 0) {
      const sanitizedContent = response.map((item) => DOMPurify.sanitize(item?.content))
      const blocksFromHTML = convertFromHTML(sanitizedContent.join(''))
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML?.contentBlocks,
        blocksFromHTML?.entityMap,
      )
      const editorContent = EditorState.createWithContent(contentState)
      setEditorState(editorContent)
    } else {
      setEditorState(EditorState.createEmpty())
    }
  }, [response])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button type="primary" size="large" className={style.condition_Button} onClick={handelSave}>
          Save
        </Button>
      </div>
      <Card>
        <Editor
          editorState={editorState}
          editorClassName={style.editorClassName}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          onEditorStateChange={onEditorStateChange}
          placeholder={
            response && response.length > 0 ? (
              <div dangerouslySetInnerHTML={createMarkup(response.map((item) => item.content))} />
            ) : (
              'Type here...'
            )
          }
        />
      </Card>
    </>
  )
}
const mapStateToProps = (state) => {
  return {
    response: state.roleAndModules.staticContent,
  }
}
export default connect(mapStateToProps)(TextEditor)
