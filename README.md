<div align="center">
  <table style="width:100%; border:none; background-color:transparent;">
    <tr>
      <td style="width:20%; text-align:left; border:none;">
      </td>
      <td style="width:60%; text-align:center; border:none;">
        <h2>TECNOLÓGICO NACIONAL DE MÉXICO</h2>
        <h3>INSTITUTO TECNOLÓGICO DE OAXACA</h3>
      </td>
      <td style="width:20%; text-align:right; border:none;">
      </td>
    </tr>
  </table>
<br>
<p><b>CARRERA:</b></p>
  <p>INGENIERÍA EN SISTEMAS COMPUTACIONALES</p>
<br>
<p><b>MATERIA:</b> PROGRAMACIÓN WEB</p>
<br>
<p><b>PRESENTA:</b></p>
<p><b>EQUIPO 12</b></p>
  <p><b>MEIXUEIRO CRUZ ARTURO DANIEL</b></p>
   <p><b>MACUIXTLE GAYTAN MIGUEL ANGEL</b></p>
<br>
<p><b>NOMBRE DEL CATEDRÁTICO:</b> MARTINEZ NIETO ADELINA</p>
<br>
<p><b>GASTOMETRO</b></p>
<br><br>
</div>
<div align="right">
  <p>23 DE JULIO DEL 2026</p>
</div>

## NOMBRE DEL PROYECTO
GASTOMETRO

## PROBLEMATICA QUE RESUELVE
No sientes que aveces te falta dinero, que creias tener mas pero en un dos por tres tu dinero se fue completamente, que quizas tienes demasiadas suscripciones, no te preocupes, a tu vida a llegado GASTOMETRO, una aplicacion que busca lidiar con la fuga silenciosa de capital y desorganizacion financiera provocada por el exceso de acumulacion de suscripciones a plataformad digitaes, muchas veces tu como usuario olvidas la fecha de corte o no te acuerda de cancelarlo lo que provoca en ti una perdida de dinero para un servicio que probablemente no usas lo que dificulta tus oportunidades de ahorro, gastometro a llegado para ayudarte a ti amigo paradigmatico con esos problemas que puede llevar a acarrear tener demasiadas suscripciones a la vez, ademas gastometro incluye un modulo especificamente para promociones los cuales te permiten avizar o advertir que promociones hay en suscripciones que permitan alivianar tus deudas, gastometro llego.

---

## Instalación

### Requisitos previos
- Node.js (v18 o superior)
- npm 
- El backend corriendo 

### Pasos

1. Clonar el repositorio y entrar a la carpeta:
   ```bash
   git clone link_repo
   cd gastometro-frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar la URL de la API. En `src/servicios/api.js` ajusta el `baseURL` según dónde esté corriendo tu backend:
   ```js
   baseURL: 'http://localhost:8000/api' 
   ```

4. Iniciar el servidor:
   ```bash
   npm run dev
   ```
---

## Estructura de vistas

La app se organiza por rol de usuario, cada uno con su propio panel:
- `cliente/PanelCliente` — usuarios con rol de cliente (rol_id 2)
- `cazaofertas/PanelCazaofertas` — usuarios con rol de cazaofertas (rol_id 3)
- `administrador/PanelAdmin` — usuarios administradores (rol_id 1)

Las rutas están protegidas por rol mediante el componente `RutaProtegida` en `App.jsx`, que valida el token guardado en `sessionStorage` y el `rol_id` correspondiente.