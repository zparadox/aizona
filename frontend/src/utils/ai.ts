export const generateRandomGenome = (): string => {
    const characters = 'ACGT';
    let result = '';
    for (let i = 0; i < 100; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  export const calculateGenomeSimilarity = (genome1: string, genome2: string): number => {
    let similarity = 0;
    const length = Math.min(genome1.length, genome2.length);
    for (let i = 0; i < length; i++) {
      if (genome1[i] === genome2[i]) {
        similarity++;
      }
    }
    return (similarity / length) * 100;
  };
  
  export const interpretGenome = (genome: string): Record<string, number> => {
    // This is a simplified interpretation. In a real AI system, this would be much more complex.
    const traits = {
      intelligence: 0,
      creativity: 0,
      efficiency: 0,
      adaptability: 0,
    };
  
    for (let i = 0; i < genome.length; i++) {
      switch (genome[i]) {
        case 'A':
          traits.intelligence += 1;
          break;
        case 'C':
          traits.creativity += 1;
          break;
        case 'G':
          traits.efficiency += 1;
          break;
        case 'T':
          traits.adaptability += 1;
          break;
      }
    }
  
    // Normalize traits
    Object.keys(traits).forEach((key) => {
      traits[key as keyof typeof traits] = (traits[key as keyof typeof traits] / genome.length) * 100;
    });
  
    return traits;
  };