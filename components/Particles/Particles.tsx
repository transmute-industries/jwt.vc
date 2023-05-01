import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-particles";
import { loadFull } from "tsparticles";


export default function({params, sx}) {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        console.log('🧠 Visit https://transmute.industries')
    }, []);
    return (
        <Particles
            id="tsparticles"
            style={{...sx}}
            init={particlesInit}
            loaded={particlesLoaded}
            options={params}
        />
    );
};