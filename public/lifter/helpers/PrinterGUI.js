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
            pasosBarrido: 5,
            pasosRevolucion: 5,
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
        revolucionFolder.add(menuValues, 'pasosRevolucion').name('Pasos').min(5).max(50).step(1)

        const barridoFolder = gui.addFolder('Barrido');
        barridoFolder.add(menuValues, 'forma2DBarrido', ['B1', 'B2', 'B3', 'B4']).name('Forma 2D');
        barridoFolder.add(menuValues, 'pasosBarrido').name('Pasos').min(5).max(50).step(1)

        gui.add(menuValues, 'anguloTorsion').name('Ángulo de torsión').min(0).max(360).step(1);
        gui.add(menuValues, 'alturaTotal').name('Altura total').min(1).max(3.2).step(0.1);
        gui.add(menuValues, 'anchoTotal').name('Ancho total').min(0.2).max(1.5).step(0.1);
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
