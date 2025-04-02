# 🎬 Movie Sphere

A modern, responsive web application for exploring movies and TV shows using the TMDB (The Movie Database) API. Built with React and styled with modern CSS.

![Movie Sphere](https://via.placeholder.com/800x400?text=Movie+Sphere+Screenshot)

## 🌟 Features

- 🎯 Real-time movie and TV show search
- 📱 Fully responsive design for all devices
- 🎨 Modern and intuitive user interface
- 📊 Detailed movie and TV show information
- ⭐ Ratings and reviews
- 🎭 Cast and crew information
- 🎥 Movie trailers and videos
- 🔍 Advanced search functionality
- 📱 Mobile-first approach
- 🌙 Dark mode support

## 🚀 Tech Stack

- **Frontend Framework:** React.js
- **Routing:** React Router v6
- **Styling:** CSS3 with Flexbox and Grid
- **API:** TMDB (The Movie Database)
- **Icons:** Font Awesome
- **State Management:** React Hooks
- **HTTP Client:** Fetch API

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-sphere.git
   ```

2. Navigate to the project directory:
   ```bash
   cd movie-sphere
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

The application requires the following environment variables:

- `VITE_TMDB_API_KEY`: Your TMDB API key
- `VITE_TMDB_BASE_URL`: TMDB API base URL (default: https://api.themoviedb.org/3)

## 🎯 Usage

1. **Home Page**
   - Browse popular movies and TV shows
   - Access different categories and genres
   - Quick access to trending content

2. **Search Functionality**
   - Real-time search for movies and TV shows
   - Advanced filtering options
   - Pagination support for search results

3. **Movie/TV Show Details**
   - Comprehensive information about selected content
   - Cast and crew details
   - Reviews and ratings
   - Related content suggestions

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktop screens (1024px and up)
- Large displays (1440px and up)

## 🔍 API Endpoints

The application uses the following TMDB API endpoints:

- `/movie/popular` - Get popular movies
- `/movie/top_rated` - Get top-rated movies
- `/movie/upcoming` - Get upcoming movies
- `/search/movie` - Search for movies
- `/movie/{id}` - Get movie details
- `/movie/{id}/credits` - Get movie credits
- `/movie/{id}/videos` - Get movie videos
- `/movie/{id}/reviews` - Get movie reviews
- `/movie/{id}/similar` - Get similar movies

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



