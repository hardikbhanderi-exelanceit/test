import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_about_sections';
  info: {
    displayName: 'About Section';
    name: 'about-section';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'>;
    isShow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedContactSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_sections';
  info: {
    displayName: 'Contact Section';
    name: 'contact-section';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    isShow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    map_link: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    displayName: 'Feature';
    name: 'feature';
  };
  attributes: {
    feature_description: Schema.Attribute.Text;
    feature_title: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedGallerySection extends Struct.ComponentSchema {
  collectionName: 'components_shared_gallery_sections';
  info: {
    displayName: 'Gallery Section';
    name: 'gallery-section';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true>;
    isShow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_sections';
  info: {
    displayName: 'Hero Section';
    name: 'hero-section';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    heading: Schema.Attribute.String;
    isShow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    logo: Schema.Attribute.Media<'images'>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedProductSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_product_sections';
  info: {
    displayName: 'Product Section';
    name: 'product-section';
  };
  attributes: {
    isShow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
    section_title: Schema.Attribute.String;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonials';
  info: {
    displayName: 'Testimonial';
    name: 'testimonial';
  };
  attributes: {
    customer_name: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    review: Schema.Attribute.RichText;
  };
}

export interface SharedTestimonialSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonial_sections';
  info: {
    displayName: 'Testimonial Section';
    name: 'testimonial-section';
  };
  attributes: {
    isShow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    section_title: Schema.Attribute.String;
    testimonials: Schema.Attribute.Component<'shared.testimonial', true>;
  };
}

export interface SharedWhyChooseUs extends Struct.ComponentSchema {
  collectionName: 'components_shared_why_choose_us';
  info: {
    displayName: 'Why Choose Us';
    name: 'why-choose-us';
  };
  attributes: {
    features: Schema.Attribute.Component<'shared.feature', true>;
    isShow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.about-section': SharedAboutSection;
      'shared.contact-section': SharedContactSection;
      'shared.feature': SharedFeature;
      'shared.gallery-section': SharedGallerySection;
      'shared.hero-section': SharedHeroSection;
      'shared.media': SharedMedia;
      'shared.product-section': SharedProductSection;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.testimonial': SharedTestimonial;
      'shared.testimonial-section': SharedTestimonialSection;
      'shared.why-choose-us': SharedWhyChooseUs;
    }
  }
}
