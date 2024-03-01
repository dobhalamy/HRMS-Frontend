import React, { useState } from 'react'
import UploadDocumentModal from './uploadDocumentModal'
import ViewDocuments from './viewDocuments'

const Documents = () => {
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)

  return (
    <>
      {showDocumentUpload && (
        <UploadDocumentModal
          setShowDocumentUpload={setShowDocumentUpload}
          showDocumentUpload={showDocumentUpload}
        />
      )}
      <ViewDocuments
        setShowDocumentUpload={setShowDocumentUpload}
        showDocumentUpload={showDocumentUpload}
      />
    </>
  )
}

export default Documents
