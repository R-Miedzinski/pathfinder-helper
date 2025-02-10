# *TODO*
 - UI design in progress: https://www.figma.com/design/YSvAatuSAxvV1ENe1gPIhm/Pathfinder-Helper?node-id=260-501&t=M1a8JChmIkW6ue57-1
 - data entry on live environment

# *ENG*
## Deployment

- project is deployed on `render` at: https://pathfinder-helper-app.onrender.com/
- after period of inactivity, waking the server up may take some time (free plan)

## Running the Project Locally

First, you need to build and link the `rpg-app-shared-package`. To do this:

Navigate to the `shared` folder:
- Run `npm install`, and after installation, run `npm run build`.
- Navigate to the `dist` folder using `cd dist`.
- Create a local link with the command: `npm link`.

In both the `web` and `api` folders, you need to link the package:
- Run `npm install`.
- Link the package with the command: `npm link rpg-app-shared-package`.

To start the project locally:

- In one terminal: navigate to the `api` folder and run: `npm run start-dev`
- In another terminal: navigate to the web folder and run: `npm run start`

The application will be available at: `http://localhost:4200/`

# *PL*
## Deployment

- aplikacja działa na hostingu `render`, dostępna pod linkiem: https://pathfinder-helper-app.onrender.com/
- po okresie nieaktywności, może być potrzeba odczekania zanim serwer się obudzi (kwestia darmowego planu render'a)

## Odpalanie projektu lokalnie
Najpierw trzeba zbudować i zalinkować rpg-app-shared-package. Żeby to zrobić trzeba:

- wejść w folder `shared`
- odpalić `npm install`, po zainstalowaniu `npm run build`
- `cd dist`
- stworzyć lokalny link komendą `npm link`

Teraz w obu folderach `web` i `api` trzeba podpiąć link do pakietu:

- `npm install`
- `npm link rpg-app-shared-package`

Aby włączyć projekt lokalnie:

- w jednym terminalu: z folderu `api`, opdalić `npm run start-dev`
- w drugim terminalu: z folderu `web`, opdalić `npm run start`

aplikacja będzie dostępna pod: `http://localhost:4200/`
