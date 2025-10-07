// Template generator utility using Handlebars to replace static values with dynamic resume data
import Handlebars from 'handlebars';

// Register Handlebars helpers
Handlebars.registerHelper('formatDate', function(dateString) {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
});

Handlebars.registerHelper('join', function(array, separator) {
  if (!array || !Array.isArray(array)) return '';
  return array.map(item => item.name || item).join(separator);
});

Handlebars.registerHelper('uppercase', function(str) {
  return str ? str.toUpperCase() : '';
});

export const generateDynamicTemplate = (templateContent, resumeInfo) => {
  if (!resumeInfo) {
    return templateContent; // Return original if no resume info
  }

  try {
    // Compile the Handlebars template
    const template = Handlebars.compile(templateContent);
    
    // Prepare the data for Handlebars
    const templateData = {
      name: resumeInfo.name || 'Your Name',
      email: resumeInfo.email || 'your.email@example.com',
      phone: resumeInfo.phone || '(555) 123-4567',
      linkedin: resumeInfo.linkedin || null,
      github: resumeInfo.github || null,
      website: resumeInfo.website || null,
      summary: resumeInfo.summary || null,
      jobRole: resumeInfo.jobRole || null,
      educations: resumeInfo.educations || null,
      experiences: resumeInfo.experiences || null,
      skills: resumeInfo.skills || null,
      projects: resumeInfo.projects || null,
      languages: resumeInfo.languages || null
    };

    // Generate the final content using Handlebars
    return template(templateData);
    
  } catch (error) {
    console.error('Error compiling Handlebars template:', error);
    // Fallback to original template if compilation fails
    return templateContent;
  }
};
