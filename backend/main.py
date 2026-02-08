from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routes import rooms, reservations

app = FastAPI(
    title="LobbyLobster API",
    description="Modern hotel management system backend",
    version="0.1.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("🦞 LobbyLobster API started successfully!")

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Welcome to LobbyLobster API",
        "version": "0.1.0",
        "status": "operational",
        "docs": "/docs",
        "endpoints": {
            "rooms": "/api/rooms",
            "reservations": "/api/reservations"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "LobbyLobster API"
    }

# Register routes
app.include_router(rooms.router, prefix="/api/rooms", tags=["rooms"])
app.include_router(reservations.router, prefix="/api/reservations", tags=["reservations"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
