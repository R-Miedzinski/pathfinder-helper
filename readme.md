# Make RPG great again!

Witam degeneratów

## Docker

W celu postawienia projektu wymagane sa:
- **docker [dla Ubuntu polecam](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)**
- **docker compose [dla Ubuntu polecam](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)**

W teorii aby apka wystartowała wystarczy w katalogu głownym wpisć

```bash
# Będąc z folderze z plikiem docker-compose.yaml
docker compose up -d
```

Jednak mogą się pojawić jakies problemy z zajętymi portami czy coś, więc piszcie w razie potrzeby

## Głowne polecenia dockera

```bash
# Będąc z folderze z plikiem docker-compose.yaml
# Wyłącza nam wszystkie kontenery związane z projektem
docker compose down
```

```bash
# Restartuje nam całość, czyści jakieś tam cache itd, taka bezpieczna komenda do resetu jeżeli dzieją się dziwne rzeczy
docker compose up -d -build --force-recreate
```

```bash
# Listuje istniejące kontenery, ich ID, nazwy, porty itd...
docker ps
```

```bash
# Podgląd dla logów konsoli wewnątrz kontenera
docker logs -f <CONTAINER_ID/NAME np. dd_web>
```

```bash
# Resetuje dany kontener - czasem potrafią się zawiesić, zwłaszcza po włączeniu systemu
docker container restart <CONTAINER_ID/NAME np. dd_web>
```

**ISTOTNE**
W projekcie mamy obrazy noda w wersji apline - takie lekkie, tam nie ma basha stąd na dole zadziała komenda z ash
```bash
# Odpala nam terminal w trybie interaktywnym danego kontenera - to tutaj powinno się dodawać paczki npm install xyz
docker exec -it <CONTAINER_ID/NAME> ash
lub
docker exec -it <CONTAINER_ID/NAME> bash
```