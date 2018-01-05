import { Layer } from '../../../leaflet/layer/Layer';

export class LeafletControlLayersConfig {
	baseLayers: { [name: string]: Layer } = {};
	overlays: { [name: string]: Layer } = {};
}
