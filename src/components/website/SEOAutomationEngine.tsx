import React, { useEffect } from 'react';
import { SEOData } from '../../types';

interface SEOAutomationEngineProps {
  seo?: Partial<SEOData>;
}

export const SEOAutomationEngine: React.FC<SEOAutomationEngineProps> = ({ seo }) => {
  const defaultSEO: SEOData = {
    title: 'TK Asy Syifa Tanggul | Sekolah Ceria, Kreatif & Berakhlak Qurani',
    description: 'Situs resmi TK Asy Syifa Tanggul Jember. Lembaga PAUD unggulan dengan pendidikan berkarakter Islami, fasilitas lengkap, dan pengajar S1 berpengalaman.',
    keywords: 'TK Asy Syifa Tanggul, PAUD Tanggul, Kindergarten Jember, Sekolah Islam Anak Tanggul, PPDB TK Asy Syifa',
    ogImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000',
    canonical: 'https://tkasysyifatanggul.sch.id',
    author: 'TK Asy Syifa Tanggul'
  };

  const finalData = { ...defaultSEO, ...seo };

  useEffect(() => {
    // Dynamically update document title
    document.title = finalData.title;

    // Helper function to update or create meta tag
    const setMetaTag = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('description', finalData.description);
    setMetaTag('keywords', finalData.keywords);
    setMetaTag('author', finalData.author);

    // OpenGraph
    setMetaTag('og:title', finalData.title, 'property');
    setMetaTag('og:description', finalData.description, 'property');
    setMetaTag('og:image', finalData.ogImage, 'property');
    setMetaTag('og:type', 'website', 'property');

    // JSON-LD Structured Schema
    let jsonLdScript = document.getElementById('jsonld-schema');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'jsonld-schema';
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }

    const schemaObject = {
      '@context': 'https://schema.org',
      '@type': 'Preschool',
      name: 'TK Asy Syifa Tanggul',
      description: finalData.description,
      url: finalData.canonical,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Raya Tanggul No. 45',
        addressLocality: 'Tanggul',
        addressRegion: 'Jember',
        postalCode: '68155',
        addressCountry: 'ID'
      },
      telephone: '+6281234567890'
    };

    jsonLdScript.textContent = JSON.stringify(schemaObject);
  }, [finalData.title, finalData.description, finalData.keywords, finalData.ogImage]);

  return null; // Side-effect only component
};
