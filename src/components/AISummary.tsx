interface Props {
    summary?: string;
}

export default function AISummary({summary}: Props) {
  return summary ? (
    <div className={`flex flex-col items-start border-2 rounded-md p-4 space-y-2`}>
      <div className="flex space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-openai" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35" /><path d="M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946" /><path d="M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348" /><path d="M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45" /><path d="M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946" /><path d="M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42" /></svg>
            <p className="font-medium">AI Summary</p>
      </div>
      <div>{summary}</div>
    </div>
  ): null;
}
