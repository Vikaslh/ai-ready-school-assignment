# Student Cognitive Skills & Performance Dashboard

A comprehensive educational analytics dashboard built with Next.js 15, React 19, and TailwindCSS 4.

## Features

### Overview Cards
- Average cognitive skills metrics (Comprehension, Attention, Focus, Retention)
- Engagement time and assessment score tracking
- Color-coded icons for easy identification

### Interactive Charts
- **Skills Correlation Chart**: Bar chart showing correlation between cognitive skills and assessment scores
- **Attention vs Assessment Scatter Plot**: Visualizes relationship between attention and performance
- **Student Radar Chart**: Individual student cognitive profile visualization

### Students Directory
- **Searchable Table**: Search by name or student ID
- **Class Filtering**: Filter students by grade/class
- **Sortable Columns**: Sort by name, ID, class, or assessment score
- **Pagination**: Navigate through large student datasets
- **Learning Personas**: Color-coded badges showing cluster assignments

### Insights & Analytics
- **ML Model Performance**: Displays prediction accuracy and key metrics
- **Feature Importance**: Shows which cognitive skills are most predictive
- **Learning Personas**: Detailed breakdown of student clusters with characteristics
- **Key Findings**: Research insights from the data analysis

## Technical Implementation

### API Endpoints
- `/api/students` - Returns all student data with cognitive skills and scores
- `/api/analytics` - Provides ML analysis results, correlations, and insights
- `/api/students/[id]` - Individual student profile data

### Components Architecture
- **Modular Design**: Each dashboard section is a separate component
- **Data Fetching**: Uses React hooks for API integration
- **Loading States**: Skeleton loaders for better UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Data Visualization
- **Recharts Integration**: Professional charts with tooltips and interactions
- **Color System**: Consistent color palette across all visualizations
- **Accessibility**: Proper contrast ratios and screen reader support

## Learning Personas (Clusters)

1. **Balanced Learners** (Blue) - Well-rounded students with consistent performance
2. **High Performers** (Green) - Top-tier students excelling across all metrics
3. **Attention Seekers** (Yellow) - Students needing focus and attention support
4. **Developing Learners** (Red) - Students requiring additional academic support

## Setup Instructions

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)

## Deployment

The dashboard is ready for deployment on Vercel with zero configuration required.

## Data Source

The dashboard uses synthetic student data generated through ML analysis, including:
- 250 student records
- Cognitive skills assessment (Comprehension, Attention, Focus, Retention)
- Engagement metrics and assessment scores
- ML-based clustering for learning personas
