# 🏁 Mario Kart 8 Deluxe - Éditeur de Sauvegarde Web

Une interface web moderne et sécurisée pour modifier les fichiers de sauvegarde de Mario Kart 8 Deluxe sur Nintendo Switch.

## 🏗️ Architecture modulaire

Ce projet utilise une **architecture modulaire** avec des petits fichiers spécialisés pour une meilleure maintenabilité et évolutivité.

## ✨ Fonctionnalités

- 🔒 **Sécurisé** : Utilise l'algorithme de checksum Nintendo officiel
- 🎯 **Précis** : Modification de 16 statistiques différentes
- 🌐 **Local** : Aucune donnée envoyée sur internet
- 📱 **Responsive** : Interface adaptée à tous les écrans
- ⚡ **Temps réel** : Validation instantanée des valeurs
- 💾 **Sauvegarde** : Téléchargement automatique des fichiers modifiés

## 🎮 Statistiques modifiables

### 💰 Monnaie & Objets
- **Pièces**

### 🏎️ Techniques de course
- **Dérapages**
- **Mini-Turbos**
- **Super Mini-Turbo**
- **Ultra Mini-Turbo**
- **Saut Synchro**

### 🏆 Points & Classements
- **Points Course** (0-4,294,967,295)
- **Points Bataille** (0-4,294,967,295)

## 🚀 Utilisation

### 1. Ouvrir l'éditeur
Ouvrez le fichier [`index.html`](index.html) dans votre navigateur web moderne.

### 2. Charger votre sauvegarde
1. Cliquez sur "Sélectionner userdata.dat"
2. Choisissez votre fichier de sauvegarde Mario Kart 8 Deluxe
3. L'éditeur valide automatiquement l'intégrité du fichier

### 3. Modifier les statistiques
1. Les valeurs actuelles s'affichent automatiquement
2. Modifiez les valeurs souhaitées dans les champs
3. La validation se fait en temps réel

### 4. Sauvegarder
1. Cliquez sur "Sauvegarder les modifications"
2. L'éditeur recalcule automatiquement le checksum
3. Téléchargez le fichier modifié

### 5. Installer sur votre Switch
1. Copiez le fichier modifié sur votre Switch
2. Remplacez l'ancien fichier de sauvegarde
3. Profitez de vos nouvelles statistiques !

## 🛠️ Architecture technique

### Structure des fichiers

```
MK8D-Editors/
├── index.html              # Interface utilisateur principale
├── css/                    # Styles modulaires
│   ├── variables.css       # Variables CSS (16 lignes)
│   ├── base.css           # Reset et base (42 lignes)
│   ├── header.css         # Header (35 lignes)
│   ├── cards.css          # Cartes (46 lignes)
│   ├── forms.css          # Formulaires (71 lignes)
│   ├── buttons.css        # Boutons (42 lignes)
│   ├── layout.css         # Mise en page (54 lignes)
│   ├── messages.css       # Messages (49 lignes)
│   └── responsive.css     # Responsive (40 lignes)
├── js/                    # JavaScript modulaire
│   ├── crypto.js          # Cryptographie (38 lignes)
│   ├── binary.js          # Binaire (50 lignes)
│   ├── fileUtils.js       # Fichiers (49 lignes)
│   ├── formatters.js      # Formatage (55 lignes)
│   ├── validation.js      # Validation (113 lignes)
│   ├── ui.js              # Interface (105 lignes)
│   ├── offsets.js         # Offsets (52 lignes)
│   ├── saveEditorCore.js  # Classe principale (162 lignes)
│   ├── saveEditorUtils.js # Extensions (120 lignes)
│   └── main.js            # Script principal (367 lignes)
└── README.md               # Documentation
```

### Technologies utilisées
- **HTML5** : Structure sémantique moderne
- **CSS3** : Design responsive avec variables CSS et animations
- **JavaScript ES6+** : Logique métier et manipulation binaire
- **Web APIs** : FileReader, Blob, URL pour la gestion des fichiers
- **Architecture modulaire** : Séparation des responsabilités et maintenabilité

### Avantages de l'architecture modulaire
- 🎯 **Maintenabilité** : Chaque fichier a une responsabilité unique
- 🚀 **Performance** : Chargement sélectif et cache optimisé
- 👥 **Collaboration** : Développement en parallèle facilité
- 🔧 **Évolutivité** : Ajout de fonctionnalités simplifié
- 🧪 **Tests** : Tests unitaires par module possibles

### Algorithme de checksum Nintendo
```javascript
function calculateNintendoChecksum(data) {
    const crc32 = calculateCRC32(data);
    return (crc32 ^ 0xb33778cd) >>> 0;
}
```

## 🔧 Développement

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (optionnel, pour le développement)

### Installation locale
```bash
# Cloner ou télécharger les fichiers
git clone <repository>

# Serveur local simple (optionnel)
python -m http.server 8000
# ou
npx serve .
```

### Structure du code

- **[`js/crypto.js`](js/crypto.js)** : CRC32 et checksum Nintendo (38 lignes)
- **[`js/binary.js`](js/binary.js)** : Lecture/écriture binaire (50 lignes)
- **[`js/fileUtils.js`](js/fileUtils.js)** : Gestion des fichiers (49 lignes)
- **[`js/formatters.js`](js/formatters.js)** : Formatage et utilitaires (55 lignes)
- **[`js/validation.js`](js/validation.js)** : Validation des données (113 lignes)
- **[`js/ui.js`](js/ui.js)** : Interface utilisateur (105 lignes)
- **[`js/offsets.js`](js/offsets.js)** : Offsets des statistiques (52 lignes)
- **[`js/saveEditorCore.js`](js/saveEditorCore.js)** : Classe principale (162 lignes)
- **[`js/saveEditorUtils.js`](js/saveEditorUtils.js)** : Extensions de classe (120 lignes)
- **[`js/main.js`](js/main.js)** : Script principal (367 lignes)

## 📊 Offsets des statistiques

| Statistique | Offset | Type | Taille |
|-------------|--------|------|--------|
| Pièces | 0x195c | uint32 | 4 bytes |
| Dérapages | 0x1968 | uint32 | 4 bytes |
| Mini-Turbos | 0x1970 | uint32 | 4 bytes |
| Super Mini-Turbo | 0x1974 | uint32 | 4 bytes |
| Ultra Mini-Turbo | 0x1978 | uint32 | 4 bytes |
| Saut Synchro | 0x1964 | uint32 | 4 bytes |
| Points Course | 0x1e94 | uint32 | 4 bytes |
| Points Bataille | 0x1e98 | uint32 | 4 bytes |

## ⚠️ Avertissements importants

1. **Sauvegarde** : Toujours faire une copie de votre fichier original
2. **Validation** : L'éditeur vérifie l'intégrité mais testez sur une sauvegarde
3. **Limites** : Respectez les valeurs maximales pour éviter les bugs
4. **Compatibilité** : Testé avec Mario Kart 8 Deluxe v3.0.1

## 🐛 Dépannage

### Le fichier ne se charge pas
- Vérifiez que c'est bien un fichier `userdata.dat`
- Vérifiez la taille (doit être exactement 80,736 bytes)
- Assurez-vous que le fichier n'est pas corrompu

### Les modifications ne s'appliquent pas
- Vérifiez que les valeurs sont dans les limites autorisées
- Assurez-vous d'avoir cliqué sur "Sauvegarder les modifications"
- Vérifiez la console du navigateur pour les erreurs

### Le fichier modifié ne fonctionne pas sur Switch
- Vérifiez que le checksum a été recalculé (affiché dans l'interface)
- Assurez-vous d'avoir remplacé le bon fichier
- Testez d'abord avec de petites modifications

## 📝 Changelog

### v1.1.2 (2025-06-24)
- 🐛 **Correction critique** : Le calcul du checksum est désormais correct. L'erreur provenait de la régénération constante de la table CRC32, qui a été optimisée pour n'être calculée qu'une seule fois.
- ✨ **Amélioration** : La logique de modification du compteur a été centralisée dans une méthode `setCounter` pour plus de robustesse.
- 🧹 **Refactoring** : Le code dupliqué et la logique erronée ont été supprimés de `main.js` et `saveEditorUtils.js`.

### v1.1.1 (2025-01-24)
- 🐛 **Correction critique** : Fonction `validateCurrentFile()` corrigée
- 🔧 **Offset corrigé** : Sauvetage Lakitu déplacé de 0x1e98 vers 0x197c
- 🧹 **Optimisation** : Suppression des doublons d'offsets
- ✅ **Validation** : Vérification complète de la cohérence du code
- 📚 **Documentation** : README mis à jour avec les corrections

### v1.1.0 (2025-01-22)
- ✨ Architecture modulaire ajoutée
- 📦 Fichiers CSS spécialisés (9 modules)
- 🧩 Fichiers JavaScript modulaires (10 modules)
- 🎯 Maintenabilité améliorée
- 🚀 Performance optimisée
- 👥 Collaboration facilitée

### v1.0.0 (2025-01-22)
- ✨ Interface web complète
- 🔒 Algorithme de checksum Nintendo intégré
- 🎨 Design moderne et responsive
- ⚡ Validation en temps réel

## 🤝 Contribution

Ce projet est basé sur le reverse engineering du format de sauvegarde Mario Kart 8 Deluxe. Les contributions sont les bienvenues pour :

- Ajouter de nouvelles statistiques
- Améliorer l'interface utilisateur
- Optimiser les performances
- Corriger les bugs

## 📄 Licence

Ce projet est à des fins éducatives et de recherche. Utilisez-le de manière responsable et respectez les conditions d'utilisation de Nintendo.
