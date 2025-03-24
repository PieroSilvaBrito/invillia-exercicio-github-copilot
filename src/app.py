"""
API do Sistema de Gerenciamento Escolar

Uma aplicação super simples usando FastAPI que permite aos estudantes visualizar
e se inscrever em atividades extracurriculares na Escola Secundária Mergington.
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os
from pathlib import Path

app = FastAPI(title="API da Escola Secundária Mergington",
              description="API para visualizar e se inscrever em atividades extracurriculares")

# Montar o diretório de arquivos estáticos
current_dir = Path(__file__).parent
app.mount("/static", StaticFiles(directory=os.path.join(Path(__file__).parent,
          "static")), name="static")

# Banco de dados de atividades em memória
activities = {
    "Chess Club": {
        "description": "Aprenda estratégias e participe de torneios de xadrez",
        "schedule": "Sextas-feiras, 15:30 - 17:00",
        "max_participants": 12,
        "participants": ["michael@mergington.edu", "daniel@mergington.edu"]
    },
    "Programming Class": {
        "description": "Aprenda fundamentos de programação e desenvolva projetos de software",
        "schedule": "Terças e Quintas, 15:30 - 16:30",
        "max_participants": 20,
        "participants": ["emma@mergington.edu", "sophia@mergington.edu"]
    },
    "Gym Class": {
        "description": "Atividades de educação física e esportes",
        "schedule": "Segundas, Quartas e Sextas, 14:00 - 15:00",
        "max_participants": 30,
        "participants": ["john@mergington.edu", "olivia@mergington.edu"]
    }
}


@app.get("/")
def root():
    return RedirectResponse(url="/static/index.html")


@app.get("/activities")
def get_activities():
    return activities


@app.post("/activities/{activity_name}/signup")
def signup_for_activity(activity_name: str, email: str):
    """Inscrever um estudante em uma atividade"""
    # Validar se a atividade existe
    if activity_name not in activities:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")

    # Obter a atividade específica
    activity = activities[activity_name]

    # Adicionar estudante
    activity["participants"].append(email)
    return {"message": f"{email} foi inscrito(a) na atividade {activity_name}"}