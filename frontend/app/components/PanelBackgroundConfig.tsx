type PlaneItem = {
    imageUrl: string;
    position: [number, number];
    scale: [number, number];
    borderColor: string;
    borderSize: number;
    text: {
      text: string;
      position: [number, number];
      color: string;
      size: number;
      boxWidth: number;
      boxHeight: number;
      boxBorderColor: string;
      boxBorderSize: number;
    };
    title: {
      text: string;
      position: [number, number];
      color: string;
      size: number;
      boxWidth: number;
      boxHeight: number;
      boxBorderSize: number;
    };
    dateAndPlace: {
      text: string;
      position: [number, number];
      color: string;
      size: number;
      boxWidth: number;
      boxHeight: number;
      boxBorderColor: string;
      boxBorderSize: number;
    };
  };

  export const PanelBackgroundConfig: PlaneItem[] = [
    {
    imageUrl: "",
    position: [-0.15, 0.32],
    scale: [0.4, 0.3],
    borderColor: "#AAAA00",
    borderSize: 0.01,
    text: {
        text: "",
        position: [0.32, 0.36],
        color: "black",
        size: 0.03,
        boxWidth: 0.25,
        boxHeight: 0.3,
        boxBorderColor: "black",
        boxBorderSize: 0.002
    },
    title: {
        text: "",
        position: [-0.15, 0.42],
        color: "black",
        size: 0.05,
        boxWidth: 0.4,
        boxHeight: 0.1,
        boxBorderSize: 0.003
    },
    dateAndPlace: {
        text: "",
        position: [0.32, 0.27],
        color: "black",
        size: 0.025,
        boxWidth: 0.25,
        boxHeight: 0.1,
        boxBorderColor: "#add8e6",
        boxBorderSize: 0.002
    }
    },
    {
    imageUrl: "",
    position: [-0.15, 0.09],
    scale: [0.35, 0.25],
    borderColor: "#AAAA00",
    borderSize: 0.01,
    text: {
        text: "",
        position: [0.22, 0.07],
        color: "black",
        size: 0.03,
        boxWidth: 0.3,
        boxHeight: 0.4,
        boxBorderColor: "black",
        boxBorderSize: 0.002
    },
    title: {
        text: "",
        position: [0, 0.17],
        color: "black",
        size: 0.04,
        boxWidth: 0.6,
        boxHeight: 0.1,
        boxBorderSize: 0.003
    },
    dateAndPlace: {
        text: "",
        position: [-0.15, -0.005],
        color: "black",
        size: 0.025,
        boxWidth: 0.4,
        boxHeight: 0.1,
        boxBorderColor: "#add8e6",
        boxBorderSize: 0.002
    }
    },
    {
    imageUrl: "",
    position: [-0.33, -0.17],
    scale: [0.22, 0.25],
    borderColor: "#AAAA00",
    borderSize: 0.01,
    text: {
        text: "",
        position: [0.15, -0.17],
        color: "black",
        size: 0.03,
        boxWidth: 0.5,
        boxHeight: 0.2,
        boxBorderColor: "black",
        boxBorderSize: 0.002
    },
    title: {
        text: "",
        position: [0.15, -0.1],
        color: "black",
        size: 0.04,
        boxWidth: 0.5,
        boxHeight: 0.1,
        boxBorderSize: 0.003
    },
    dateAndPlace: {
        text: "",
        position: [0.15, -0.23],
        color: "black",
        size: 0.025,
        boxWidth: 0.4,
        boxHeight: 0.1,
        boxBorderColor: "#add8e6",
        boxBorderSize: 0.002
    }
    },
    {
    imageUrl: "",
    position: [-0.15, -0.4],
    scale: [0.35, 0.25],
    borderColor: "#AAAA00",
    borderSize: 0.01,
    text: {
        text: "",
        position: [0.22, -0.38],
        color: "black",
        size: 0.03,
        boxWidth: 0.3,
        boxHeight: 0.25,
        boxBorderColor: "black",
        boxBorderSize: 0.002
    },
    title: {
        text: "",
        position: [0, -0.3],
        color: "black",
        size: 0.04,
        boxWidth: 0.6,
        boxHeight: 0.1,
        boxBorderSize: 0.003
    },
    dateAndPlace: {
        text: "",
        position: [0.22, -0.46],
        color: "black",
        size: 0.025,
        boxWidth: 0.3,
        boxHeight: 0.1,
        boxBorderColor: "#add8e6",
        boxBorderSize: 0.002
    }
    },
];