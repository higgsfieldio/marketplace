import json
import config
from models.tokens import TokensWithRarity, TokensWithoutRarity


async def update_attributes_rarity(contract_address: str):
    d = {}
    tokens = list(config.db.tokens.find({"contract_id": contract_address}))
    attributes = list()
    tokens_copy = tokens.copy()
    poped = 0
    for elem_id in range(len(tokens_copy)):
        elem = tokens_copy[elem_id]
        if elem['reference'] is not None:
            attributes.append(dict(attributes=elem['reference']['attributes']))
        elif elem['metadata']['extra'] is not None:
            try:
                attrs_as_json = json.loads(elem['metadata']['extra'])['attributes']
                attributes.append(dict(attributes=attrs_as_json))
                config.db.tokens.update_one({"_id": elem['_id']},
                                            {"$set": {"metadata.extra_attributes": attrs_as_json}})
            except Exception as e:
                print(f'attrs json load err: {e}')
                tokens.pop(elem_id - poped)
                poped += 1
        else:
            tokens.pop(elem_id - poped)
            poped += 1
    first_copy = dict(tokens=attributes)
    without_rarity = False
    with_rarity = False
    try:
        TokensWithoutRarity(**first_copy)
        without_rarity = True
    except Exception as e:
        print(f'TokensWithoutRarity err: {e}')
    if not without_rarity:
        try:
            TokensWithRarity(**first_copy)
            with_rarity = True
        except Exception as e:
            print(f'TokensWithoutRarity err: {e}')
    if not without_rarity and not with_rarity:
        raise ValueError('Tokens should be either with rarity attrs or without it')
    for elem in attributes:
        for elem2 in elem['attributes'].copy():
            if elem2['value'] == 'None':
                elem['attributes'].remove(elem2)
                continue
            if with_rarity:
                continue
            if elem2['trait_type'] not in d:
                d[elem2['trait_type']] = dict()
            if elem2['value'] in d[elem2['trait_type']]:
                d[elem2['trait_type']][elem2['value']] += 1
            else:
                d[elem2['trait_type']][elem2['value']] = 1
        attributes_length = len(elem['attributes'])
        if 'length' not in d:
            d['length'] = dict()
        if attributes_length in d['length']:
            d['length'][attributes_length] += 1
        else:
            d['length'][attributes_length] = 1
    new_d = {}
    for elem in list(d.keys()):
        new_d[elem] = {}
        sum1 = sum(d[elem].values())
        for in_elem in list(d[elem].keys()):
            percent = d[elem][in_elem] * 10 ** (2 + 5) / sum1 / 10 ** 5
            s = "{1:.{0}f}".format(2, percent)
            new_d[elem][in_elem] = s.rstrip('0').rstrip('.') + '%' if '.' in s else s + '%'
            s = 1 / (round(percent, 5) / 100)
            d[elem][in_elem] = s

    config.db.tokens.update_many(
        {
            "contract_id": contract_address},
        {
            "$set": {"attributes": []}
        }
    )
    for elem in list(d.keys()):
        for in_elem in list(d[elem].keys()):
            config.db.tokens.update_many(
                {
                    "contract_id": contract_address,
                    "$or": [
                        {
                            "reference.attributes": {
                                "$elemMatch": {
                                    "trait_type": elem,
                                    "value": in_elem}
                            }
                        },
                        {
                            "metadata.extra_attributes": {
                                "$elemMatch": {
                                    "trait_type": elem,
                                    "value": in_elem}
                            }
                        }
                    ]

                },
                {
                    "$push": {
                        "attributes": {
                            "trait_type": elem,
                            "value": in_elem,
                            "rarity": d[elem][in_elem]
                        }
                    }
                }
            )
    if without_rarity:
        for token in config.db.tokens.find({"contract_id": contract_address}):
            attrs = token['attributes']
            if len(attrs) == 0:
                config.db.tokens.update_one({"_id": token['_id']}, {"$set": {"attributes": None}})
                continue
            score = d['length'][len(attrs)]
            for elem in attrs.copy():
                if elem['value'] == 'None':
                    attrs.remove(elem)
                    continue
                score += elem['rarity']
                elem['rarity'] = new_d[elem['trait_type']][elem['value']]

            attrs.append(dict(trait_type="Attributes Count", value=len(attrs), rarity=new_d['length'][len(attrs)]))
            config.db.tokens.update_one({"_id": token['_id']}, {"$set": {"score": score,
                                                                         "attributes": attrs}})
    else:
        for token in config.db.tokens.find({"contract_id": contract_address}):
            if token['reference'] is not None and 'attributes' in token['reference'] \
                    and token['reference']['attributes'] is not None:
                attrs = token['reference']['attributes']
            elif token['metadata']['extra'] is not None:
                try:
                    attrs = json.loads(token['metadata']['extra'])['attributes']
                except Exception as e:
                    print(f'attrs json load err: {e}')
                    continue
            else:
                continue
            if len(attrs) == 0:
                config.db.tokens.update_one({"_id": token['_id']}, {"$set": {"attributes": None}})
                continue
            score = d['length'][len(attrs)]
            for elem in attrs.copy():
                if elem['value'] == 'None':
                    attrs.remove(elem)
                    continue
                elem['rarity'] = elem['rarity'].replace(',', '.')
                s = 1 / (round(float(elem['rarity'].strip('%')), 5) / 100)
                score += s
            attrs.append(dict(trait_type="Attributes Count", value=len(attrs), rarity=new_d['length'][len(attrs)]))
            config.db.tokens.update_one({"_id": token['_id']}, {"$set": {"score": score,
                                                                         "attributes": attrs}})

    min_rank = 1
    last_score = None
    for elem in config.db.tokens.find({"contract_id": contract_address, "score": {"$ne": None}}).sort([("score", -1)]):
        if last_score is None:
            last_score = elem['score']
            rank = min_rank
        else:
            if last_score == elem['score']:
                rank = min_rank
            else:
                min_rank += 1
                rank = min_rank
        config.db.tokens.update_one({"_id": elem["_id"]},
                                    {"$set": {"rank": rank}})
