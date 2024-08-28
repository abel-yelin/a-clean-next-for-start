import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // PDF图标

interface ReferenceUploaderProps {
  onReferenceChange: (reference: string, files: File[]) => void;
}

const ReferenceUploader: React.FC<ReferenceUploaderProps> = ({ onReferenceChange }) => {
  const [reference, setReference] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newReference = event.target.value;
    setReference(newReference);
    onReferenceChange(newReference, files); // 传递文件数组
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
      onReferenceChange(reference, [...files, ...uploadedFiles]); // 传递文件数组
      const newPreviewUrls = uploadedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f7f7f7' }}>
      <Typography variant="h6" gutterBottom>
        上传参考资料
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="输入URL或文本参考"
              value={reference}
              onChange={handleReferenceChange}
              InputProps={{
                startAdornment: <InsertLinkIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
            <Box>
              <input
                accept=".pdf,image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                multiple
                onChange={handleFileUpload}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{ width: '100%', height: '100px', border: '2px dashed #ccc' }}
                >
                  {files.length > 0 ? `${files.length} 个文件已上传` : '点击或拖拽上传PDF/图片'}
                </Button>
              </label>
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: '4px', p: 2 }}>
          <Typography variant="h6">预览</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
            {files.length > 0 ? (
              files.map((file, index) => (
                <Box key={index} sx={{ mt: 1, mr: 1, width: 'calc(33% - 8px)', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                  {file.type === 'application/pdf' ? (
                    <>
                      <PictureAsPdfIcon sx={{ fontSize: 40, color: 'red', mr: 1 }} />
                      <Typography variant="body2">{file.name}</Typography>
                    </>
                  ) : (
                    <img src={previewUrls[index]} alt={`Preview ${index}`} style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'cover' }} />
                  )}
                </Box>
              ))
            ) : (
              <Typography variant="body2">预览不可用</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ReferenceUploader;


