import { GUI } from 'dat.gui';

export class PrinterGUI {
    constructor(tridimensionalPrinterManager, onPrintCallback) {
        this.tridimensionalPrinterManager = tridimensionalPrinterManager;
        this.onPrintCallback = onPrintCallback;

        this.menuValues = {
            tipoSuperficie: 'revolucion',
            forma2DRevolucion: 'A1',
            forma2DBarrido: 'B1',
            anguloTorsion: 0,
            alturaTotal: 1,
            anchoTotal: 1,
            pasosGeneracion: 5,
            pasosCurva: 5,
            textura: 'tex1.png',
            imprimir: () => {
                try {
                    this.tridimensionalPrinterManager.print(this.menuValues);
                    if (this.onPrintCallback) this.onPrintCallback(this.menuValues);
                } catch (err) {
                    console.error(`Error: ${err}`);
                }
            }
        };
    }

    generate() {
        const gui = new GUI();
        const { menuValues } = this;

        const tipoController = gui.add(menuValues, 'tipoSuperficie', ['revolucion', 'barrido']).name('Tipo de Superficie');

        const revolucionFolder = gui.addFolder('Revolución');
        revolucionFolder.add(menuValues, 'forma2DRevolucion', ['A1', 'A2', 'A3', 'A4']).name('Forma 2D');

        const barridoFolder = gui.addFolder('Barrido');
        barridoFolder.add(menuValues, 'forma2DBarrido', ['B1', 'B2', 'B3', 'B4']).name('Forma 2D');

        const textureMap = {
            'Texture 1': 'tex1.png',
            'Texture 2': 'tex2.png',
            'Texture 3': 'tex3.png',
            'Texture 4': 'tex4.png',
            'Texture 5': 'tex5.png',
            'Texture 6': 'tex6.png',
            'Texture 7': 'tex7.png',
            'Texture 8': 'tex8.png',
            'Texture 9': 'tex9.png',
        };

        gui.add({ textureLabel: 'Texture 1' }, 'textureLabel', Object.keys(textureMap))
            .name('Textura')
            .onChange(label => {
                menuValues.textura = textureMap[label];
            });

        gui.add(menuValues, 'anguloTorsion').name('Ángulo de torsión').min(0).max(360).step(1);
        gui.add(menuValues, 'alturaTotal').name('Altura total').min(1).max(3.2).step(0.1);
        gui.add(menuValues, 'anchoTotal').name('Ancho total').min(0.5).max(1.5).step(0.1);
        gui.add(menuValues, 'pasosGeneracion').name('Pasos Gen').min(5).max(50).step(1)
        gui.add(menuValues, 'pasosCurva').name('Pasos Curva').min(5).max(50).step(1)
        gui.add(menuValues, 'imprimir').name('Imprimir');

        const updateVisibility = () => {
            const isBarrido = menuValues.tipoSuperficie === 'barrido';
            barridoFolder.domElement.style.display = isBarrido ? '' : 'none';
            revolucionFolder.domElement.style.display = isBarrido ? 'none' : '';
        };

        tipoController.onChange(updateVisibility);
        updateVisibility();

        return menuValues;
    }
}
