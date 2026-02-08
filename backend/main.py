from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routes import rooms, reservations, guests, invoices


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup/shutdown"""
    # Startup
    init_db()
    print("🦞 LobbyLobster API started successfully!")
    yield
    # Shutdown (if needed in the future)
    print("👋 LobbyLobster API shutting down...")


app = FastAPI(
    title="LobbyLobster API",
    description="Modern hotel management system backend",
    version="0.1.0",
    lifespan=lifespan
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
app.include_router(guests.router, prefix="/api/guests", tags=["guests"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["invoices"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
