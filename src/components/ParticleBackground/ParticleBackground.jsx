import React, { useEffect, useMemo, useState, memo } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function ParticleBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // const particlesLoaded = (container) => {
        // console.log("Particles loaded: ", container);
    // };

    const options = useMemo(() => ({
        particles: {
            number: {
                value: 120,
            },
            color: {
                value: "#d2d2d2",
            },
            links: {
                enable: true,
                color: "#d2d2d2",
                distance: 150,
                opacity: 0.4,
                width: 2,
            },
            move: {
                enable: true,
                speed: 1.5,
            },
            opacity: {
                value: 0.5,
                animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.1,
                    sync: false
                }
            },
            size: {
                value: { min: 1, max: 3 },
                animation: {
                    enable: true,
                    speed: 4,
                    minimumValue: 1,
                    sync: false
                }
            }
        },
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "repulse"
                },
                // onClick: {
                //     enable: true,
                //     mode: "push"
                // }
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    quantity: 4
                }
            }
        }
    }), []);

    return (
        <div>
            {init && (
                <Particles
                    id="tsparticles"
                    options={options}
                    // particlesLoaded={particlesLoaded}
                />
            )}
        </div>
    );
}

export default memo(ParticleBackground);