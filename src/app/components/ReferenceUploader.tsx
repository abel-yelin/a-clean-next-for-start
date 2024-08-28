import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

interface ReferenceUploaderProps {
  onReferenceChange: (reference: string, file: File | null) => void;
}

const ReferenceUploader: React.FC<ReferenceUploaderProps> = ({ onReferenceChange }) => {
  const [reference, setReference] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReference(event.target.value);
    onReferenceChange(event.target.value, file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      onReferenceChange(reference, uploadedFile);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f7f7f7' }}>
      <Typography variant="h6" gutterBottom>
        上传参考资料
      </Typography>
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
            onChange={handleFileUpload}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{ width: '100%', height: '100px', border: '2px dashed #ccc' }}
            >
              {file ? file.name : '点击或拖拽上传PDF/图片'}
            </Button>
          </label>
        </Box>
      </Box>
    </Paper>
  );
};

export default ReferenceUploader;


