import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchPageBySlug } from '../utils/api';
import DynamicSection from '../components/sections/DynamicSection';
import './DynamicPage.css';

const DynamicPage = ({ slug: propSlug, onSectionsLoad }) => {
  const { slug: paramSlug } = useParams();
  const slug = propSlug || paramSlug || 'home';

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        const data = await fetchPageBySlug(slug);
        setPageData(data);
        setError(null);

        // Pass sections to parent component for Header navigation
        if (onSectionsLoad && data?.sections) {
          onSectionsLoad(data.sections);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading page:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [slug, onSectionsLoad]);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader-content">
          <div className="spinner"></div>
          <p>Loading Excellence...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="page-error">
        <div className="error-content">
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { seo_title, seo_description, sections } = pageData;

  return (
    <>
      <Helmet>
        <title>{seo_title || "Di'aaru - Timeless Brilliance"}</title>
        <meta
          name="description"
          content={seo_description || "Discover luxury lab-grown diamonds"}
        />
      </Helmet>

      <main className="dynamic-page">
        {sections?.map((section, index) => (
          <DynamicSection
            key={`section-${index}-${section.id || ''}`}
            section={section}
            index={index}
          />
        ))}
      </main>
    </>
  );
};

export default DynamicPage;
