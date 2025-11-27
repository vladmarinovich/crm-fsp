content = """DEBUG=True
SECRET_KEY=django-insecure-fallback-key
ALLOWED_HOSTS=*
DATABASE_URL=postgresql://postgres.eklwejarpzmconvtupxb:Tristana!!2124@aws-1-us-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://eklwejarpzmconvtupxb.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbHdlamFycHptY29udnR1cHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTc0NTksImV4cCI6MjA3NzA3MzQ1OX0.wV652_keQ3f6jBLUeSv3d0ZZ3lPeCm8q3WTLUZxfYNY
"""

with open('.env', 'w') as f:
    f.write(content)

print(".env file created successfully")
print("Content:")
print(open('.env').read())
