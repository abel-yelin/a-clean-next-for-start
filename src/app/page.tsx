'use client';
import { useState, useEffect } from 'react';
import { Tabs, Tab, Box, TextField, Button, Select, MenuItem, IconButton, styled } from '@mui/material';
import { Upload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('./components/PageContainer'), { ssr: false });
import DashboardCard from '@/app/components/DashboardCard';
// 自定义样式的Tabs组件
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

// 自定义样式的Tab组件
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  padding: '12px 16px',
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: '16px',
  marginRight: theme.spacing(1),
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 1,
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const languages = [
  'English', '简体中文', '繁體中文', '日本語', 'Português', 
  'Español', 'Deutsch', 'Français', 'Tiếng Việt', 'العربية',
  'Nederlands', 'Polski'
];

interface ContentData {
  title: string;
  subtitle: string;
  url: string;
  order: number;
  category: string;
  previewImages: string[];
  keywords: string;
  description: string;
  tags: string;
  sections: Section[];
}

interface Section {
  id: number;
  title: string;
  content: string[];
}

const ContentPage = () => {
  const [currentLang, setCurrentLang] = useState(0);
  const [contentData, setContentData] = useState<Record<string, ContentData>>(
    Object.fromEntries(languages.map(lang => [lang, {
      title: '', subtitle: '', url: '', order: 0, category: '',
      previewImages: [], keywords: '', description: '', tags: '', sections: []
    }]))
  );

  useEffect(() => {
    // 加载数据
    loadContent();
  }, []);

  const loadContent = async (language = 'en') => {
    try {
      const response = await fetch(`/api/aigenerate?language=${language}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setContentData(prev => ({
            ...prev,
            [language]: data[0]
          }));
        }
      } else {
        console.error('加载内容失败');
      }
    } catch (error) {
      console.error('加载内容时出错:', error);
    }
  };

  const saveContent = async () => {
    try {
      const mainLanguage = languages[0];
      const contentToSave = {
        ...contentData[mainLanguage],
        translations: contentData
      };

      // 检查 title 是否存在且不为空
      if (!contentToSave.title || contentToSave.title.trim() === '') {
        alert('Title is required');
        return;
      }

      console.log('Saving content:', contentToSave);
      const response = await fetch('/api/aigenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentToSave),
      });
      if (response.ok) {
        const data = await response.json();
        alert(`内容成功保存,英文ID: ${data.english.id}`);
      } else {
        const errorData = await response.json();
        console.error('保存失败:', errorData);
        alert(`保存内容失败: ${errorData.error}\n${errorData.details || ''}`);
      }
    } catch (error) {
      console.error('保存内容时出错:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('保存内容时出错: ' + errorMessage);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentLang(newValue);
  };

  const updateField = (field: keyof ContentData, value: any) => {
    setContentData(prev => ({
      ...prev,
      [languages[currentLang]]: {
        ...prev[languages[currentLang]],
        [field]: value
      }
    }));
  };

  const addSection = () => {
    setContentData(prev => ({
      ...prev,
      [languages[currentLang]]: {
        ...prev[languages[currentLang]],
        sections: [
          ...prev[languages[currentLang]].sections,
          { id: Date.now(), title: '', content: [''] }
        ]
      }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 这里应该实现实际的图片上传逻辑
      // 暂时使用本地 URL 作为示例
      const imageUrl = URL.createObjectURL(file);
      updateField('previewImages', [...contentData[languages[currentLang]].previewImages, imageUrl]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...contentData[languages[currentLang]].previewImages];
    newImages.splice(index, 1);
    updateField('previewImages', newImages);
  };

  return (
    <PageContainer title="Multilingual Content Editor" description="Edit multilingual content">
      <DashboardCard title="Multilingual Content Editor">
        <Box>
          <StyledTabs 
            value={currentLang} 
            onChange={handleChange} 
            variant="scrollable" 
            scrollButtons="auto"
            aria-label="language tabs"
          >
            {languages.map((lang, index) => (
              <StyledTab key={lang} label={lang} value={index} />
            ))}
          </StyledTabs>
          <Box sx={{ mt: 4, px: 2 }}> {/* 增加了上边距和左右内边距 */}
            <TextField
              fullWidth
              label="Title"
              value={contentData[languages[currentLang]].title}
              onChange={(e) => updateField('title', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Subtitle"
              value={contentData[languages[currentLang]].subtitle}
              onChange={(e) => updateField('subtitle', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Website"
              value={contentData[languages[currentLang]].url}
              onChange={(e) => updateField('url', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Order"
              type="number"
              value={contentData[languages[currentLang]].order}
              onChange={(e) => updateField('order', parseInt(e.target.value))}
              sx={{ mb: 2 }}
            />
            <Select
              fullWidth
              value={contentData[languages[currentLang]].category}
              onChange={(e) => updateField('category', e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">选择类别</MenuItem>
              <MenuItem value="AI Learning">AI Learning</MenuItem>
              <MenuItem value="Technical Research">Technical Research</MenuItem>
              {/* 添加更多类别选项 */}
            </Select>
            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                  Upload Preview Image <UploadIcon />
                </Button>
              </label>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                {contentData[languages[currentLang]].previewImages.map((img, index) => (
                  <Box key={index} sx={{ position: 'relative', m: 1 }}>
                    <img src={img} alt={`Preview ${index + 1}`} style={{ width: 100, height: 100, objectFit: 'cover' }} />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
            <TextField
              fullWidth
              label="Keywords"
              value={contentData[languages[currentLang]].keywords}
              onChange={(e) => updateField('keywords', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={contentData[languages[currentLang]].description}
              onChange={(e) => updateField('description', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Tags"
              value={contentData[languages[currentLang]].tags}
              onChange={(e) => updateField('tags', e.target.value)}
              helperText="Separate multiple tags with commas"
              sx={{ mb: 2 }}
            />
            {contentData[languages[currentLang]].sections.map((section, index) => (
              <Box key={section.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
                <TextField
                  fullWidth
                  label={`Section ${index + 1} Title`}
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...contentData[languages[currentLang]].sections];
                    newSections[index] = { ...newSections[index], title: e.target.value };
                    updateField('sections', newSections);
                  }}
                  sx={{ mb: 1 }}
                />
                {section.content.map((content, contentIndex) => (
                  <TextField
                    key={contentIndex}
                    fullWidth
                    multiline
                    rows={3}
                    label={`Content ${contentIndex + 1}`}
                    value={content}
                    onChange={(e) => {
                      const newSections = [...contentData[languages[currentLang]].sections];
                      newSections[index] = {
                        ...newSections[index],
                        content: [
                          ...newSections[index].content.slice(0, contentIndex),
                          e.target.value,
                          ...newSections[index].content.slice(contentIndex + 1)
                        ]
                      };
                      updateField('sections', newSections);
                    }}
                    sx={{ mb: 1 }}
                  />
                ))}
                <Button onClick={() => {
                  const newSections = [...contentData[languages[currentLang]].sections];
                  newSections[index] = {
                    ...newSections[index],
                    content: [...newSections[index].content, '']
                  };
                  updateField('sections', newSections);
                }}>
                  添加内容
                </Button>
              </Box>
            ))}
            <Button onClick={addSection}>Add New Section</Button>
          </Box>
          <Button onClick={saveContent} variant="contained" color="primary" sx={{ mt: 2 }}>
            Save Content
          </Button>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default ContentPage;