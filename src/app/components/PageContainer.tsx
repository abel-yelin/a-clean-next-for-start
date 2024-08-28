import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface PageContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, description, children }) => (
  <HelmetProvider>
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </div>
  </HelmetProvider>
);

export default PageContainer;