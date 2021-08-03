const init = () => {
    if (!"geolocation" in navigator) {
        return alert("Tu navegador no soporta el acceso a la ubicación. Intenta con otro");
    }

    const ZOOM = 15;
    let mapa = null, marcador = null;
    const $estado = document.querySelector("#estado");
    const formateador = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'medium' });
    const formatearFecha = fecha => formateador.format(fecha);

    const onActualizacionDeUbicacion = ubicacion => {
        const coordenadas = ubicacion.coords;
        let { latitude, longitude } = coordenadas;

        const icono = "ubicacion.png";
        if (!mapa) {
            // Primera vez, lo creamos y centramos
            mapa = new ol.Map({
                target: 'mapa', // el id del elemento en donde se monta
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([longitude, latitude]),
                    zoom: ZOOM,
                })
            });
            marcador = new ol.Feature({
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat([longitude, latitude])
                ),
            });
            marcador.setStyle(new ol.style.Style({
                image: new ol.style.Icon(({
                    src: icono,
                    scale: 0.5, // Aquí puedes ampliar o disminuir la imagen
                })),
            }));
            const ultimaCapa = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [marcador],
                }),
            });
            mapa.addLayer(ultimaCapa);
        }
        // Actualización de ubicación
        mapa.getView().setCenter(ol.proj.fromLonLat([longitude, latitude]));
        marcador.getGeometry().setCoordinates(ol.proj.fromLonLat([longitude, latitude]));
        const fecha = formatearFecha(new Date(ubicacion.timestamp));
        const registro = `Última actualización: ${fecha} en ${latitude},${longitude}`;
        console.log(registro);
        $estado.textContent = registro;
    }

    const onErrorDeUbicacion = err => {
        console.log("Error obteniendo ubicación: ", err);
    }


    const opcionesDeSolicitud = {
        enableHighAccuracy: true, // Alta precisión
        maximumAge: 0, // No queremos caché
        timeout: 5000 // Esperar solo 5 segundos
    };

    idWatcher = navigator.geolocation.watchPosition(onActualizacionDeUbicacion, onErrorDeUbicacion, opcionesDeSolicitud);
}
init();