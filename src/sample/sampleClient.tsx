'use client';

import { sampleServerAction } from './sampleServerActions';

export function SampleClient() {
	return (
		<button
			onClick={async () => {
				sampleServerAction();
			}}>
			Server Client Button
		</button>
	);
}
