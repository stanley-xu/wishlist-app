#!/usr/bin/env node

/**
 * Generate a Storybook story file for a React Native component
 *
 * Usage:
 *   npm run generate:story components/YourComponent.tsx
 *   npm run generate:story components/layout/Stack.tsx
 */

const fs = require('fs');
const path = require('path');

// Get component path from command line arguments
const componentPath = process.argv[2];

if (!componentPath) {
  console.error('Error: Please provide a component path');
  console.error('Usage: npm run generate:story components/YourComponent.tsx');
  process.exit(1);
}

// Resolve the full path
const fullPath = path.resolve(process.cwd(), componentPath);

// Check if file exists
if (!fs.existsSync(fullPath)) {
  console.error(`Error: Component file not found at ${fullPath}`);
  process.exit(1);
}

// Extract component name and directory info
const componentFileName = path.basename(componentPath, path.extname(componentPath));
const componentDir = path.dirname(componentPath);
const storyPath = path.join(componentDir, `${componentFileName}.stories.tsx`);

// Check if story file already exists
if (fs.existsSync(storyPath)) {
  console.error(`Error: Story file already exists at ${storyPath}`);
  console.error('Delete it first if you want to regenerate it.');
  process.exit(1);
}

// Read the component file to try to extract interface/type info
const componentContent = fs.readFileSync(fullPath, 'utf-8');

// Try to find exported component name
const exportMatch = componentContent.match(/export (?:default )?(?:function|const|class) (\w+)/);
const componentName = exportMatch ? exportMatch[1] : componentFileName;

// Try to find interface/type for props
const interfaceMatch = componentContent.match(/(?:interface|type) (\w+Props)/);
const hasProps = !!interfaceMatch;

// Determine story category based on directory structure
let storyCategory = 'Components';
if (componentDir.includes('layout')) {
  storyCategory = 'Layout';
} else if (componentDir.includes('buttons')) {
  storyCategory = 'Components';
} else if (componentDir.includes('Card')) {
  storyCategory = 'Components';
}

// Determine import path (relative from story file location)
const importPath = `./${componentFileName}`;

// Check if it's a default export or named export
const isDefaultExport = componentContent.includes(`export default ${componentName}`) ||
                        componentContent.includes(`export default function ${componentName}`);

const importStatement = isDefaultExport
  ? `import ${componentName} from '${importPath}';`
  : `import { ${componentName} } from '${importPath}';`;

// Generate the story template
const storyTemplate = `import type { Meta, StoryObj } from '@storybook/react';
${importStatement}

const meta = {
  title: '${storyCategory}/${componentName}',
  component: ${componentName},
  argTypes: {
    // Add argTypes here for interactive controls
    // Example:
    // variant: {
    //   control: 'select',
    //   options: ['primary', 'secondary'],
    // },
  },
  args: {
    // Default args for all stories
  },
} satisfies Meta<typeof ${componentName}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add your default story args here
  },
};

// Add more stories as needed
// export const AnotherVariant: Story = {
//   args: {
//     // Different args for this variant
//   },
// };
`;

// Write the story file
fs.writeFileSync(storyPath, storyTemplate);

console.log(`✓ Story file created: ${storyPath}`);
console.log('');
console.log('Next steps:');
console.log('1. Open the story file and customize the argTypes');
console.log('2. Add proper args to each story');
console.log('3. Create additional story variants as needed');
console.log('');
console.log(`Detected component: ${componentName}`);
console.log(`Export type: ${isDefaultExport ? 'default' : 'named'}`);
if (hasProps) {
  console.log(`Props interface: ${interfaceMatch[1]}`);
  console.log('Tip: Check the component file to see available props and add them to argTypes');
}
