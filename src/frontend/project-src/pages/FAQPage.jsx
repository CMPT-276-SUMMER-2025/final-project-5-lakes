import { HelpCircle, FileText, Edit, Palette, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function FAQPage() {
  const faqs = [
    {
      question: 'Can I view my past charts?',
      answer:
        'Our website does not currently support user accounts or data storage, so past charts are not saved. To keep a copy of your work, please download your chart before creating a new one or leaving the site.',
      icon: FileText,
    },
    {
      question: 'Can I edit data after creating the chart?',
      answer:
        'Yes! Even after you have made your chart, you can go back to the data-editing stage and modify your data. Any changes you make will be reflected in the chart, allowing you to update your visualizations until they fit your requirements.',
      icon: Edit,
    },
    {
      question: 'What parts of the chart are customizable?',
      answer:
        "EasyChart gives you control over several key aspects of your chart's appearance. You can customize the text, including the chart title, and change the charts color palette and font style to match your preferences.",
      icon: Palette,
    },
    {
      question: 'Can I choose a specific type of chart to use?',
      answer:
        'To simplify the process, our website automatically suggests the best types of charts to use based on your data. You can select which one you like best out of the suggestions.',
      icon: HelpCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6 sm:p-10 font-inter">
      

      <div className="w-full max-w-6xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-lg md:text-xl text-gray-600">

        </p>

      </div>


      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => {
          const Icon = faq.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <div className="flex items-center mb-2">
                <Icon size={30} className="text-blue-600 mr-3 flex-shrink-0" />
                <h3 className="text-xl font-semibold text-blue-600">
                  {faq.question}
                </h3>
              </div>
              <p className="text-gray-700 text-lg mt-4">
                {faq.answer}
              </p>
            </div>
          );
        })}
      </div>

       <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 mt-8 text-lg font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusCircle size={24} className="mr-2" />
          Create a Chart
        </Link>
    </div>
  );
}

export default FAQPage;
