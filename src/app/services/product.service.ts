import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
        id: 1,
        name: 'Windows 11 Home',
        description: 'Licencia digital para Windows 11 Home. Es la última versión del sistema operativo de Microsoft, diseñado para ofrecer una experiencia de usuario moderna y fluida. Con una interfaz renovada, Windows 11 proporciona un entorno más intuitivo y eficiente, ideal tanto para el trabajo como para el entretenimiento. Disfruta de características avanzadas como Snap Layouts, un nuevo menú de inicio centrado, y una integración mejorada con Microsoft Teams. Además, incluye actualizaciones de seguridad y rendimiento, asegurando que tu dispositivo esté siempre protegido y funcionando de manera óptima.',
        price: 119.99,
        type: 'home',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxv7_o77kBDjqcfOaTNN9Jt-tkQABGUCSxPw&s',
        installationInstructions: [
            '1. Descargar el Instalador: Accede al enlace proporcionado en el correo electrónico que recibiste tras la compra. Haz clic en el enlace para descargar el instalador de Windows 11 Home.',
            '2. Preparar el Medio de Instalación: Si deseas instalar Windows 11 desde un USB, utiliza la herramienta de creación de medios de Microsoft para grabar la imagen ISO en un dispositivo USB.',
            '3. Ejecutar el Instalador: Si estás instalando desde un archivo descargado, localiza el archivo .exe y haz doble clic para ejecutarlo. Si estás usando un USB, reinicia tu computadora y arranca desde el USB.',
            '4. Seguir el Asistente de Instalación: Una vez que el instalador se inicie, sigue las instrucciones en pantalla. Acepta los términos de la licencia y selecciona el tipo de instalación (actualización o instalación limpia).',
            '5. Introducir la Clave de Producto: Cuando se te solicite, introduce la clave de producto que recibiste al comprar Windows 11 Home.',
            '6. Completar la Instalación: Espera a que el proceso de instalación finalice. Esto puede tardar varios minutos. Una vez completada la instalación, configura tu cuenta de usuario y preferencias.',
            '7. Actualizar el Sistema: Después de la instalación, asegúrate de buscar actualizaciones en la configuración de Windows para tener la última versión y parches de seguridad.'
        ]
    },
      {
        id: 2,
        name: 'Windows 11 Pro',
        description: 'Sistema operativo Windows 11 Pro con todas las características premium para profesionales y empresas. Incluye BitLocker, Windows Sandbox, Hyper-V y conexión a dominios.',
        price: 119.99,
        type: 'pro',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc2G_IfOm6KwsiXUb7cfYXqLyDdi9nQuxapg&s',
        installationInstructions: [
          '1. Visita settings.windows.com/activation',
          '2. Inicia sesión con tu cuenta de Microsoft',
          '3. Selecciona Cambiar clave de producto',
          '4. Ingresa la clave de producto recibida',
          '5. Sigue las instrucciones en pantalla para completar la activación',
          '6. Reinicia tu equipo cuando se solicite'
        ]
      },
      {
        id: 3,
        name: 'Windows 10 Pro',
        description: 'Versión profesional de Windows 10 con características avanzadas de seguridad y productividad. Perfecto para pequeñas empresas y profesionales independientes.',
        price: 119.99,
        type: 'pro',
        imageUrl: 'https://3clics.mx/images/stories/virtuemart/product/licencia-windows-10.jpg',
        installationInstructions: [
          '1. Abre Configuración de Windows',
          '2. Ve a Actualización y seguridad > Activación',
          '3. Selecciona Cambiar clave de producto',
          '4. Ingresa la clave de licencia proporcionada',
          '5. Espera a que se complete la activación',
          '6. Reinicia el sistema si es necesario'
        ]
      },
      {
        id: 4,
        name: 'Windows 10 Home',
        description: 'Edición básica de Windows 10 perfecta para uso personal y familiar. Incluye todas las características esenciales como Windows Defender y Microsoft Edge.',
        price: 119.99,
        type: 'home',
        imageUrl: 'https://cdnx.jumpseller.com/keyxpress-mexico1/image/30735061/Windows_10_Home.png?1704147323',
        installationInstructions: [
          '1. Abre Configuración de Windows',
          '2. Selecciona Actualización y seguridad',
          '3. Haz clic en Activación',
          '4. Ingresa tu clave de producto',
          '5. Espera la confirmación de activación',
          '6. Reinicia tu computadora'
        ]
      },
      {
        id: 5,
        name: 'Office Pro Plus 19 Telefonica',
        description: 'Suite completa de productividad Microsoft Office 2019 que incluye versiones completas de Word, Excel, PowerPoint, Outlook, Publisher y Access.',
        price: 99.99,
        type: 'proplus',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOejoH0zG10Iu-FnQXaakbYv5oMM-iq0mmQ&s',
        installationInstructions: [
          '1. Ve a office.com/setup',
          '2. Inicia sesión con tu cuenta Microsoft',
          '3. Ingresa el código de producto recibido',
          '4. Selecciona tu idioma y versión',
          '5. Haz clic en Instalar Office',
          '6. Ejecuta el instalador descargado',
          '7. Espera a que finalice la instalación'
        ]
      },
      {
        id: 6,
        name: 'Office 21 Pro Plus Telefonica',
        description: 'La última versión de Microsoft Office con características mejoradas de IA y colaboración en la nube. Incluye Word, Excel, PowerPoint, Outlook, Publisher y Access.',
        price: 99.99,
        type: 'proplus',
        imageUrl: 'https://dharmacorpstore.com/wp-content/uploads/2023/03/office_2021_professional_plus_800x.jpg',
        installationInstructions: [
          '1. Ve a office.com/setup',
          '2. Inicia sesión en tu cuenta Microsoft',
          '3. Introduce la clave de producto',
          '4. Selecciona preferencias de instalación',
          '5. Descarga el instalador de Office',
          '6. Ejecuta la instalación',
          '7. Activa el producto con tu cuenta'
        ]
      },
      {
        id: 7,
        name: 'Office 21 Home and Business MAC',
        description: 'Versión de Microsoft Office 2021 optimizada para macOS. Incluye Word, Excel, PowerPoint, Outlook y OneNote con interfaz adaptada para Mac.',
        price: 799.99,
        type: 'home&bussiness',
        imageUrl: 'https://softwaredepot.co/cdn/shop/files/microsoft-microsoft-office-2021-home-business-mac-33718832758973_1280x.png?v=1700460079',
        installationInstructions: [
          '1. Abre el App Store de Mac',
          '2. Inicia sesión con tu Apple ID',
          '3. Descarga las aplicaciones de Office',
          '4. Abre cualquier app de Office',
          '5. Inicia sesión con tu cuenta Microsoft',
          '6. Ingresa la clave de producto',
          '7. Espera la activación automática'
        ]
      },
      {
        id: 8,
        name: 'Kaspersky 2024 Standar Antivirus',
        description: 'Protección antivirus de última generación con tecnología adaptativa contra amenazas emergentes. Incluye protección en tiempo real y salvaguarda contra ransomware.',
        price: 299.99,
        type: 'antivirus',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI6HHRWxeva1h-ChbYpMuvAusbIBIdjqPwgA&s',
        installationInstructions: [
          '1. Descarga el instalador de Kaspersky',
          '2. Ejecuta el archivo descargado',
          '3. Acepta los términos de licencia',
          '4. Selecciona tipo de instalación',
          '5. Espera a que se complete la instalación',
          '6. Inicia el programa',
          '7. Ingresa el código de activación'
        ]
      },
      {
        id: 9,
        name: 'Avast 2024 Pro Antivirus',
        description: 'Solución antivirus profesional con firewall inteligente, protección contra phishing y herramientas de optimización del sistema.',
        price: 249.99,
        type: 'antivirus',
        imageUrl: 'https://blitzhandel24.imgbolt.de/media/image/d8/2d/b5/Avast-Antivirus-Pro-2022.jpg',
        installationInstructions: [
          '1. Descarga Avast desde el sitio oficial',
          '2. Ejecuta el instalador',
          '3. Selecciona Instalación personalizada',
          '4. Elige los componentes deseados',
          '5. Completa la instalación',
          '6. Abre Avast',
          '7. Ingresa tu código de licencia'
        ]
      },
      {
        id: 10,
        name: 'Autodesk Student Account 1 Año',
        description: 'Acceso educativo completo al ecosistema Autodesk, incluyendo AutoCAD, Revit, Maya, 3ds Max, Fusion 360 y más.',
        price: 399.99,
        type: 'autodesk',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMkCwkDHgIAV9y-aMpgquN-rsRh71SJDFUGQ&s',
        installationInstructions: [
          '1. Visita account.autodesk.com',
          '2. Crea una cuenta con tu email educativo',
          '3. Verifica tu estatus de estudiante',
          '4. Activa tu suscripción con el código',
          '5. Descarga Autodesk Desktop App',
          '6. Instala los programas deseados',
          '7. Inicia sesión en cada aplicación'
        ]
      },
      {
        id: 11,
        name: 'Microsoft 365 Personal 1 Año',
        description: 'Suscripción premium que incluye las últimas versiones de las aplicaciones de Office, 1TB de almacenamiento en OneDrive y características exclusivas de IA.',
        price: 59.99,
        type: 'office365',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR04SqaCOS8J2h6T7bSTkN4UVgqtoBiqvZvjg&s',
        installationInstructions: [
          '1. Visita office.com',
          '2. Inicia sesión con tu cuenta Microsoft',
          '3. Ingresa el código de suscripción',
          '4. Selecciona Instalar Office',
          '5. Elige las aplicaciones deseadas',
          '6. Descarga e instala el paquete',
          '7. Configura OneDrive'
        ]
      },
      {
        id: 12,
        name: 'Software Economico',
        description: 'Paquete básico de software esencial a precio accesible. Incluye herramientas fundamentales para productividad y seguridad.',
        price: 5,
        type: 'home',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbVHjJwSbiZHk0iRtyBtUi3Tiux8D4RDqqGw&s',
        installationInstructions: [
          '1. Descarga el instalador desde el enlace proporcionado',
          '2. Ejecuta el archivo de instalación',
          '3. Sigue el asistente de instalación',
          '4. Selecciona los componentes deseados',
          '5. Completa la instalación',
          '6. Activa el software con tu licencia'
        ]
      }
  ];

  getProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products.find(product => product.id === id);
  }
} 