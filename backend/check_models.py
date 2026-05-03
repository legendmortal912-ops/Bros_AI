import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load your new paid key from .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("Available Models for your account:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)