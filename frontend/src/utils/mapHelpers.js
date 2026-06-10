import insectIcon from "../assets/markers/insect.svg";
import mammalIcon from "../assets/markers/mammal.svg";
import plantIcon from "../assets/markers/plant.svg";
import birdIcon from "../assets/markers/bird.svg";
import spiderIcon from "../assets/markers/spider.svg";
import otherIcon from "../assets/markers/other.svg";

// This helper returns the correct marker icon for a report type.
export function getMarkerIconByType(report) {
    const pestType = (report?.pest_type || report?.organism_type || "").toLowerCase();

    if (pestType.includes("insect")) return insectIcon;
    if (pestType.includes("mammal")) return mammalIcon;
    if (pestType.includes("plant")) return plantIcon;
    if (pestType.includes("bird")) return birdIcon;
    if (pestType.includes("spider")) return spiderIcon;

    return otherIcon;
}

export {
    insectIcon,
    mammalIcon,
    plantIcon,
    birdIcon,
    spiderIcon,
    otherIcon,
};