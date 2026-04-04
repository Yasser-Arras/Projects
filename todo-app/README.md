# 📝 Todo App — Laravel

Une application de gestion de tâches simple, construite avec Laravel.

---

## ⚙️ Installation

### 1. Installer les dépendances PHP
```bash
composer install
```

### 2. Installer les dépendances Node et compiler les assets
```bash
npm install
npm run dev
```

### 3. Créer le fichier d'environnement
Créer un fichier `.env` à la racine du projet :
```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:GENERATE_KEY
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=todo_app
DB_USERNAME=root
DB_PASSWORD=
```



Ensuite, générer la clé de l'application :
```bash
php artisan key:generate
```

### 4. Lancer les migrations
```bash
php artisan migrate
```

### 5. Démarrer l'application
```bash
php artisan serve
```

L'application est accessible sur **http://127.0.0.1:8000**

---

## 🚀 Utilisation

| Fonctionnalité | Description |
|---|---|
| **Ajouter une tâche** | Entrer un titre, choisir l'importance, cliquer sur *Ajouter* |
| **Changer le statut** | Cliquer sur l'icône : À faire → En cours → Terminé |
| **Modifier le titre** | Cliquer sur le titre pour l'éditer, puis appuyer sur Entrée |
| **Supprimer** | Survoler la tâche, puis cliquer sur × |
| **Date limite** | Cliquer sur le badge de temps pour choisir une date |
| **Importance** | Cliquer sur le badge pour cycler : Faible / Moyen / Élevé |
| **Filtrer / Trier** | Filtrer par importance, trier par temps ou importance |
| **Rechercher** | Taper dans la barre de recherche pour filtrer par titre |

---


## 💡 Extensions possibles...

- Notifications
- Tâches récurrentes
- Filtres avancés
