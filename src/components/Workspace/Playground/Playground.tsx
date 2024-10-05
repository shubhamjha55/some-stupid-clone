import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import { toast } from "react-toastify";
import { problems } from "@/utils/problems";
import { useRouter } from "next/router";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Tooltip } from "@nextui-org/react";

type PlaygroundProps = {
	problem: Problem;
	setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
	setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
	fontSize: string;
	settingsModalIsOpen: boolean;
	dropdownIsOpen: boolean;
}

const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved }) => {
	const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");

	const [settings, setSettings] = useState<ISettings>({
		fontSize: fontSize,
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});

	const {
		query: { pid },
	} = useRouter();

	useEffect(() => {
		const code = localStorage.getItem(`code-${pid}`);
		//To be used later
		//localStorage.setItem(`code-${pid}`, JSON.stringify(value));
		//setUserCode(code ? JSON.parse(code) : problem.starterCode);
	}, [pid, problem.starterCode]);

	const onChange = (value: string) => {
		// /setUserCode(value);
		const updatedFiles = [...files];
		updatedFiles[currentFileIndex].content = value;
		localStorage.setItem(`code-${pid}`, JSON.stringify(value));
	};

	const [files, setFiles] = useState([{ name: 'file1.js', content: problem.starterCode }]); // Initial file
	const [currentFileIndex, setCurrentFileIndex] = useState(0);

	const handleFileChange = (index: number) => {
		setCurrentFileIndex(index);
	};

	const handleCodeChange = (value: string) => {
		if(files.length === 0) {
			addNewFile();
		} else if(currentFileIndex >= files.length) {
			setCurrentFileIndex(0);
		}
		const updatedFiles = [...files];
		updatedFiles[currentFileIndex].content = value;
		setFiles(updatedFiles);
	};

	const addNewFile = () => {
		setFiles([...files, { name: `file${files.length + 1}.js`, content: problem.starterCode }]);
		setCurrentFileIndex(files.length); // Switch to the newly created file
	};

	const removeFile = (index: number) => {
		const updatedFiles = files.filter((_, i) => i !== index);
		setFiles(updatedFiles);

		if (index === currentFileIndex || index >= updatedFiles.length) {
			setCurrentFileIndex(0); // Select the first file by default after deletion
		} else if (index < currentFileIndex) {
			setCurrentFileIndex(currentFileIndex - 1); // Adjust index if earlier file is removed
		}
	};

	return (
		<div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
			<PreferenceNav settings={settings} setSettings={setSettings} />
			<div className='flex items-center'>
				{files.length && files.map((file, index) => (
					<div className='flex flex-col'>
						<button
							key={index}
							className={`relative cursor-pointer rounded focus:outline-none text-dark-label-2 hover:bg-dark-fill-3 px-9 py-1.5 pl-3 
								${index === currentFileIndex ?  'bg-dark-fill-2 border-t-2 border-blue-500 shadow-md' : 'border-r border-b border-gray-700'}`} 
							onClick={() => handleFileChange(index)}
						>
							{file.name}
							<Tooltip content={'Remove File'} placement={'bottom'} delay={0} className='relative bg-gray-800 text-white px-2 py-1 rounded-lg shadow-md text-sm'>
								<button
									onClick={() => removeFile(index)}
									className='absolute top-[-2px] right-0 hover:bg-dark-fill-3 text-white-400 hover:text-white-600 px-2 py-2'
								>
									×
								</button>
							</Tooltip>
						</button>
					</div>
				))}
				<button onClick={addNewFile} className='flex cursor-pointer rounded focus:outline-none text-dark-label-2 hover:bg-dark-fill-2  pl-3 px-2 py-1.5 font-medium'>
					+ 
				</button>
			</div>
			<Split className='h-[calc(100vh-94px)]'>
				<div className='w-full overflow-auto'>
				{files.length && 
					<CodeMirror
						value={files[currentFileIndex]?.content}
						theme={vscodeDark}
						onChange={handleCodeChange}
						extensions={[javascript()]}
						style={{ fontSize: settings.fontSize }}
					/>}
				</div>
				
			</Split>
			
		</div>
	);
};
export default Playground;
