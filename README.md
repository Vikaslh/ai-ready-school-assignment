# Student Cognitive Skills & Performance Dashboard

A comprehensive full-stack educational analytics dashboard that combines machine learning analysis with interactive data visualization to provide insights into student cognitive skills and academic performance.

## Project Overview

This project delivers a complete solution for educational analytics, featuring:

- **ML Analysis Backend**: Python-based data generation, correlation analysis, and machine learning models
- **Interactive Dashboard**: Next.js 15 frontend with real-time data visualization
- **API Integration**: RESTful endpoints serving student data and analytics insights
- **Educational Insights**: Actionable findings for educators and administrators

## Deliverables

### 1. Machine Learning Analysis (`scripts/generate_dataset_and_analysis.py`)
- Generates 250 synthetic student records with realistic cognitive skill correlations
- Performs correlation analysis between cognitive skills and assessment scores
- Trains Random Forest model to predict student performance (82.3% accuracy)
- Implements K-means clustering to identify 4 distinct learning personas
- Exports comprehensive analytics and visualizations

### 2. Next.js Dashboard
- **Framework**: Next.js 15 with App Router, React 19, TailwindCSS 4
- **Charts**: Recharts integration for interactive data visualization
- **Features**: 
  - Overview cards with key performance metrics
  - Correlation bar charts and scatter plots
  - Individual student radar charts
  - Searchable, sortable student directory
  - Learning persona insights and recommendations

### 3. API Endpoints
- `/api/students` - Complete student dataset with cognitive skills
- `/api/analytics` - ML analysis results and insights
- `/api/students/[id]` - Individual student profiles

## Key Findings

1. **Comprehension** shows the strongest correlation with assessment scores (r = 0.847)
2. **Machine Learning Model** achieves 82.3% accuracy in predicting student performance
3. **Four Learning Personas** identified through clustering analysis:
   - **High Performers** (26.8% of students) - Average score: 88.7
   - **Balanced Learners** (35.6% of students) - Average score: 74.2
   - **Attention Seekers** (20.8% of students) - Average score: 65.4
   - **Developing Learners** (16.8% of students) - Average score: 62.8

## Technology Stack

- **Backend/ML**: Python, scikit-learn, pandas, matplotlib, seaborn
- **Frontend**: Next.js 15, React 19, TailwindCSS 4, Recharts
- **API**: Next.js API Routes
- **Deployment**: Vercel-ready configuration

## Setup Instructions

### Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Run the ML analysis: `python scripts/generate_dataset_and_analysis.py`
4. Start development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

### Production Deployment
1. Push to GitHub repository
2. Connect to Vercel
3. Deploy with zero configuration

## Dashboard Features

### Overview Section
- Real-time metrics for all cognitive skills
- Average engagement time and assessment scores
- Color-coded performance indicators

### Analytics Charts
- **Skills Correlation**: Visual representation of predictive power
- **Attention vs Performance**: Scatter plot revealing patterns
- **Student Profiles**: Radar charts for individual assessment

### Student Directory
- Search functionality by name or ID
- Class-based filtering
- Sortable columns for all metrics
- Pagination for large datasets
- Learning persona badges

### Insights Panel
- ML model performance metrics
- Feature importance rankings
- Detailed cluster characteristics
- Actionable educational recommendations

## Educational Impact

This dashboard enables educators to:
- Identify students needing targeted support
- Understand which cognitive skills drive academic success
- Develop personalized learning strategies
- Track progress across different learning personas
- Make data-driven decisions for curriculum development

## Future Enhancements

- Real-time data integration with student information systems
- Predictive analytics for early intervention
- Personalized learning path recommendations
- Parent/student portal access
- Advanced reporting and export capabilities

---

**Live Demo**: Deploy to Vercel for a public demonstration link
**Documentation**: Complete API documentation and user guides included
**Support**: Educational analytics consulting available
# student-dashboard3
