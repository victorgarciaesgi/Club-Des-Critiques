Club des Critiques

Développer en Symfony 3

Pour déployer, il faut faire un git clone du projet.

Exécuter la commande suivante dans le dossier du projet :

	Mettre à jour les vendor :
	
	-	composer update
	
	Mettre à jour la base de donnée (ORM) :
	
	-	php bin/console doctrine:schema:update --force
	
	Mettre en production les paramètres :
	
	-	php bin/console cache:clear --env=prod --no-debug