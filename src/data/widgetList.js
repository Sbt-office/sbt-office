import treeImage from "../assets/images/widgets/treeImage.png";
import excelImage from "../assets/images/widgets/excel.png";
import wordImage from "../assets/images/widgets/word.png";
import pptImage from "../assets/images/widgets/ppt.png";
import pdfImage from "../assets/images/widgets/pdf.png";
import zipImage from "../assets/images/widgets/zip.png";
import hwpImage from "../assets/images/widgets/hwp.png";
import youtubeImage from "../assets/images/widgets/youtube.png";

export const widgetList = [
  {
    id: 1,
    src: treeImage,
    name: "christmasTree",
    alt: "christmas tree",
    title: "Christmas Tree",
    description: "Christmas Tree",
  },
];

export const fileWidgetList = [
  {
    id: 1,
    src: excelImage,
    name: "excel",
    extension: ["xlsx", "xls"],
    alt: "excel",
    title: "Excel",
    description: "Excel File",
  },
  {
    id: 2,
    src: wordImage,
    name: "word",
    extension: ["docx", "doc"],
    alt: "word",
    title: "Word",
    description: "Word File",
  },
  {
    id: 3,
    src: pptImage,
    name: "ppt",
    extension: ["pptx", "ppt"],
    alt: "PowerPoint",
    title: "PowerPoint",
    description: "PowerPoint File",
  },
  {
    id: 4,
    src: pdfImage,
    name: "pdf",
    extension: ["pdf"],
    alt: "pdf",
    title: "PDF",
    description: "PDF File",
  },
  {
    id: 5,
    src: zipImage,
    name: "zip",
    extension: ["zip", "rar", "7z", "tar", "gz", "bz2", "xz", "tgz", "zipx"],
    alt: "zip",
    title: "ZIP",
    description: "ZIP File",
  },
  {
    id: 6,
    src: hwpImage,
    name: "hwp",
    extension: ["hwp"],
    alt: "hwp",
    title: "HWP",
    description: "HanCom File",
  },
  {
    id: 7,
    src: youtubeImage,
    name: "youtube",
    extension: ["mp4", "webm", "ogg", "mp3", "wav", "m4a", "flv", "mov", "mkv", "avi"],
    alt: "youtube",
    title: "Youtube",
    description: "Youtube File",
  },
];
