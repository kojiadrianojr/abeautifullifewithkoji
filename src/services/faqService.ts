import faqData from "@/../config/faq.json";

export interface FAQQuestion {
	id: number;
	question: string;
	answer: string;
	category: string;
}

export interface FAQData {
	title: string;
	questions: FAQQuestion[];
}

export class FAQService {
	/**
	 * Get all FAQ data
	 */
	static getFAQData(): FAQData {
		return faqData as FAQData;
	}

	/**
	 * Get FAQs by category
	 */
	static getFAQsByCategory(category: string): FAQQuestion[] {
		return faqData.questions.filter(
			(q) => q.category === category,
		) as FAQQuestion[];
	}

	/**
	 * Get all unique categories
	 */
	static getCategories(): string[] {
		const categories = faqData.questions.map((q) => q.category);
		return Array.from(new Set(categories));
	}

	/**
	 * Search FAQs by keyword
	 */
	static searchFAQs(keyword: string): FAQQuestion[] {
		const lowerKeyword = keyword.toLowerCase();
		return faqData.questions.filter(
			(q) =>
				q.question.toLowerCase().includes(lowerKeyword) ||
				q.answer.toLowerCase().includes(lowerKeyword),
		) as FAQQuestion[];
	}
}
