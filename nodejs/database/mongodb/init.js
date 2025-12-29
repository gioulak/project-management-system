db = db.getSiblingDB('micro_teams');
db.createCollection('teams');
print('Teams database initialized');

db = db.getSiblingDB('micro_tasks');
db.createCollection('tasks');
print('Tasks database initialized');