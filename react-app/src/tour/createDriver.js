import Driver from "driver.js"; 
import "driver.js/dist/driver.min.css"; 

export const createDriver = () => {
    return new Driver({
		animate: true,
		opacity: 0.50,
		allowClose: false,
		doneBtnText: "Finish",
	})
}

export const createTransparentDriver = () => {
	return new Driver({
		animate: true,
		opacity: 0.50,
		allowClose: false,
		doneBtnText: "Finish",
		stageBackground: 'rgba(255, 255, 255, 0)',
	});
}