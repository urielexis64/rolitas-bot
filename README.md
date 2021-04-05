<!-- prettier-ignore -->
# Rolitas Bot

Un bot de Telegram que consulta diferentes playlists de **Spotify**.

## Paquetes utilizados

-   axios
-   express
-   cors
-   dotenv
-   node-telegram-bot-api

Instálalos mediante el comando `npm install`

## Funciones

-   Consultar las últimas **n** (5 por defecto) canciones mediante el comando <br> ```/last{playlistName} n``` donde ```{playlistName}``` puede ser: 
    - rolitas 
    - ardientes 
    - dirty 
    - buendia

    Un ejemplo sería ```/lastrolitas 10``` lo cual daría como resultado un mensaje con las últimas 10 canciones agregadas a la playlist.

    <p align='center'>
        <img src="screenshots\last rolitas.jpg" width=40% />
    </p>
    <br>

-   Te avisa mediante un mensaje cuando una nueva canción es agregada a alguna de las 4 playlists <br><br>
<p align='center'>
    <img src="screenshots\new rolitas.jpg" width='40%' />
</p>

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)
