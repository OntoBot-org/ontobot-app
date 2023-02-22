class Taxonomy:
    taxonomy_result = []

    def __init__(self, result=None):
        if result is not None:
            Taxonomy.taxonomy_result.clear()
            Taxonomy.taxonomy_result = result
    
    def update_taxonomy_result(self, result):
        Taxonomy.taxonomy_result.clear()
        Taxonomy.taxonomy_result = result
    
    def get_taxonomy_result(self):
        return Taxonomy.taxonomy_result